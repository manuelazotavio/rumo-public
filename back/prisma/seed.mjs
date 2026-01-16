import { PrismaClient } from '@prisma/client'
import { fakerPT_BR as faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  
 
  const saltRounds = 10;
  const standardPassword = 'senha123';
  const standardPasswordHash = await bcrypt.hash(standardPassword, saltRounds);
  

  const usersToCreate = 20;
  const usersData = [];

  for (let i = 0; i < usersToCreate; i++) {
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email({ provider: 'fakeprovider.com' }).toLowerCase(),
      phone: faker.phone.number('12 9####-####'),
      admin: faker.number.int({ min: 0, max: 1 }),
      pass: standardPasswordHash,
    });
  }

  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });
  

  const atracoesToCreate = 50;
  const atracoesData = [];
  const bairrosCaragua = ['Centro', 'Indaiá', 'Porto Novo', 'Massaguaçu', 'Martim de Sá', 'Prainha', 'Capricórnio', 'Cocanha', 'Mococa', 'Tabatinga', 'Pontal de Santa Marina', 'Jaraguazinho'];
  const categories = ['Praia', 'Trilha', 'Restaurante', 'Passeio de Barco', 'Quiosque', 'Mirante', 'Sorveteria', 'Pousada', 'Loja de Artigos de Praia', 'Pesca Esportiva'];
  
  for (let i = 0; i < atracoesToCreate; i++) {
    const category = faker.helpers.arrayElement(categories);
    const bairro = faker.helpers.arrayElement(bairrosCaragua);
    
    let companyName = '';
    if (category === 'Restaurante' || category === 'Quiosque') {
        companyName = `${category} do ${faker.person.firstName()}`;
    } else if (category === 'Pousada') {
        companyName = `${category} Aconchegante de ${bairro}`;
    } else {
        companyName = `${faker.company.name()} - ${category}`;
    }
    
    const slug = faker.helpers.slugify(companyName).toLowerCase();

    atracoesData.push({
      name: companyName,
      slug: slug,
      cpfcnpj: faker.string.numeric(14),
      tipoatuacao: faker.helpers.arrayElement(['PRIVADO', 'PUBLICO']),
      phone: faker.phone.number('12 38##-####'),
      category: category,
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      email: faker.internet.email({ firstName: slug, provider: 'atracao.fake' }).toLowerCase(),
      website: `www.${slug}.com.br`,
      address: `${faker.helpers.arrayElement(['Rua', 'Avenida'])} ${faker.location.street()}, ${faker.number.int({ min: 10, max: 2000 })}`,
      cep: `116${faker.number.int({ min: 60, max: 79 })}-${faker.string.numeric(3)}`, 
      bairro: bairro,
      cadastur: faker.string.numeric(10),
      preco: faker.helpers.arrayElement(['Gratuito', '$$', '$$$', '$']),
      instagram: `@${slug}`,
      status: 'ATIVO',
      passHash: standardPasswordHash,
    });
  }

  await prisma.atracao.createMany({
    data: atracoesData,
    skipDuplicates: true,
  });
  
}

main()
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });