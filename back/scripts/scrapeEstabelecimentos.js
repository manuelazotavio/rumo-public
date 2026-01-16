import axios from 'axios';
import cheerio from 'cheerio';
import pLimit from 'p-limit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const CONCURRENCY = 3;
const RETRY_ATTEMPTS = 3;
const DELAY_MS = 600; 
const USER_AGENT = 'Mozilla/5.0 (compatible; CaraguaScraper/1.0)';

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function tryFetchAxios(url) {
  for (let i = 0; i < RETRY_ATTEMPTS; i++) {
    try {
      const res = await axios.get(url, {
        timeout: 15000,
        headers: { 'User-Agent': USER_AGENT }
      });
      return res.data;
    } catch (err) {
      console.warn(`axios fetch failed ${url} attempt ${i + 1}: ${err.message}`);
      await sleep(400 * (i + 1));
    }
  }
  return null;
}

async function tryFetchPuppeteer(url) {

  try {
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const html = await page.content();
    await browser.close();
    return html;
  } catch (err) {
    console.warn('puppeteer unavailable or failed:', err.message);
    return null;
  }
}

// Generic list parser: adapt to target site
function parseListPage_generic(html, baseUrl) {
  const $ = cheerio.load(html);
  const items = [];
  // Generic heuristics:
  // find links that likely point to detail pages
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const text = $(el).text().trim();
    // heuristics: links that contain "/empresa" or have text and aren't anchors
    if ((/empresa|estabeleciment|restaurante|hotel|loja|comércio|atracao/i).test(href) || text.length > 3) {
      let url = href;
      if (!/^https?:\/\//i.test(href)) {
        try {
          const base = new URL(baseUrl);
          url = new URL(href, base).toString();
        } catch (e) {
          return;
        }
      }
      items.push({ url, text });
    }
  });

  // De-dup
  const uniq = [];
  const seen = new Set();
  for (const it of items) {
    if (!seen.has(it.url)) {
      seen.add(it.url);
      uniq.push(it);
    }
  }
  return uniq;
}

// Generic detail parser: adapt selectors for the real target site
function parseDetail_generic(html, sourceUrl) {
  const $ = cheerio.load(html);

  const nome = $('h1').first().text().trim() || $('meta[property="og:title"]').attr('content') || $('title').text().trim();
  const address = $('[itemprop="address"]').text().trim() || $('.address').text().trim() || $('p:contains("Rua")').first().text().trim();
  const phone = $('a[href^="tel:"]').first().text().trim() || $('p:contains("Tel")').first().text().trim();
  const email = $('a[href^="mailto:"]').first().text().trim() || $('p:contains("@")').first().text().trim();
  const website = $('a[href^="http"]').filter((i, el) => {
    const href = $(el).attr('href');
    return !/facebook|instagram|twitter|youtube/i.test(href);
  }).first().attr('href') || null;
  const category = $('[itemprop="servesCuisine"]').text().trim() || $('.category').first().text().trim() || null;
  const description = $('meta[name="description"]').attr('content') || $('p').first().text().trim() || null;

  // images
  const imagens = [];
  $('img').each((i, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && src.length > 10) {
      imagens.push(src.startsWith('http') ? src : new URL(src, sourceUrl).toString());
    }
  });

  // try coords in data attributes or scripts
  let latitude = null;
  let longitude = null;
  const coordsMatch = html.match(/(["'\(]|:)\s*([-+]?\d{1,3}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)/);
  if (coordsMatch) {
    latitude = parseFloat(coordsMatch[2]);
    longitude = parseFloat(coordsMatch[3]);
  }

  return {
    nome: nome || null,
    address: address || null,
    phone: phone || null,
    email: email || null,
    website: website || null,
    category: category || null,
    description: description || null,
    imagens: imagens.length ? imagens : null,
    latitude,
    longitude,
    sourceUrl
  };
}

async function upsertAtracao(data) {
  // map scraped fields to atracao model fields
  // atracao requires: name (name), cpfcnpj (required), tipoatuacao (required), passHash (required)
  const nome = data.nome || 'Sem nome';
  const address = data.address || null;
  const phone = data.phone || 'S/N';
  const email = data.email || null;
  const website = data.website || null;
  const category = data.category || 'Geral';
  const description = data.description || null;

  // try to find by email first, then by name+address
  let found = null;
  if (email) {
    found = await prisma.atracao.findFirst({ where: { email } });
  }
  if (!found && nome && address) {
    found = await prisma.atracao.findFirst({ where: { name: nome, address } });
  }

  // create a sensible default cpfcnpj and passHash
  const cpfcnpj = '00000000000';
  const tipoatuacao = 'ESTABELECIMENTO';
  const rawPass = uuidv4();
  const passHash = await bcrypt.hash(rawPass, 10);

  if (found) {
    const updated = await prisma.atracao.update({
      where: { id: found.id },
      data: {
        name: nome,
        phone,
        category,
        description,
        email,
        website,
        address,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        // keep cpfcnpj and passHash as-is to avoid overwriting real registrations
      }
    });

    // upsert images: simple approach - insert new images if not existing url for this atracao
    if (Array.isArray(data.imagens) && data.imagens.length) {
      for (const img of data.imagens) {
        const exists = await prisma.imagens.findFirst({ where: { atracaoId: updated.id, url: img } });
        if (!exists) {
          await prisma.imagens.create({ data: { atracaoId: updated.id, type: 'photo', url: img } });
        }
      }
    }

    return updated;
  } else {
    // create new record - must set required fields
    const created = await prisma.atracao.create({
      data: {
        name: nome,
        cpfcnpj,
        tipoatuacao,
        phone,
        category,
        description,
        email,
        website,
        address,
        cep: null,
        bairro: null,
        referencia: null,
        cadastur: null,
        preco: null,
        instagram: null,
        passHash,
        // slug, confirmationToken left null
        imagens: {
          create: Array.isArray(data.imagens) && data.imagens.length ? data.imagens.map((u) => ({ type: 'photo', url: u })) : []
        }
      }
    });
    return created;
  }
}

async function main() {
  // Lista inicial de páginas de listagem — substitua pelas URLs reais que deseja varrer
  const listPages = [
    // exemplo: 'https://www.caraguatatuba.sp.gov.br/portal/servicos/restaurantes',
  ];

  if (listPages.length === 0) {
    console.log('Nenhuma URL de lista configurada. Edite `listPages` no arquivo para incluir páginas a serem raspadas.');
    await prisma.$disconnect();
    return;
  }

  const limit = pLimit(CONCURRENCY);

  for (const listUrl of listPages) {
    console.log('Processando página de lista:', listUrl);
    let html = await tryFetchAxios(listUrl);
    if (!html) html = await tryFetchPuppeteer(listUrl);
    if (!html) {
      console.warn('Falha ao obter HTML da list page:', listUrl);
      continue;
    }

    const items = parseListPage_generic(html, listUrl);
    console.log(`Encontrados ${items.length} links (heurística) na página ${listUrl}`);

    const tasks = items.map((item) => limit(async () => {
      await sleep(DELAY_MS);
      let detailHtml = await tryFetchAxios(item.url);
      if (!detailHtml) detailHtml = await tryFetchPuppeteer(item.url);
      if (!detailHtml) {
        console.warn('Não foi possível recuperar detalhe:', item.url);
        return;
      }

      const parsed = parseDetail_generic(detailHtml, item.url);
      try {
        const saved = await upsertAtracao(parsed);
        console.log('Salvo/atualizado atracao id=', saved.id, ' name=', saved.name);
      } catch (err) {
        console.error('Erro salvando atracao para', item.url, err.message || err);
      }
    }));

    await Promise.all(tasks);
  }

  console.log('Processo de scraping finalizado');
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Fatal error', err);
  await prisma.$disconnect();
  process.exit(1);
});
