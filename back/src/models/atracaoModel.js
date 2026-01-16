import prisma from "../config/prisma.js";
import { z } from "zod";

const atracaoSchema = z.object({
  id: z.number().optional(),

  name: z
    .string({ required_error: "Nome é obrigatório." })
    .min(3, { message: "O nome deve ter no mínimo 3 letras." })
    .max(250, { message: "O nome deve ter no máximo 250 caracteres." }),

  cpfcnpj: z.string().optional(),

  guiaId: z.number().optional().nullable(),

  phone: z.string().max(50).optional(),

  categorias: z.array(z.number(), {
    required_error: "Categoria é obrigatória.",
  }),

  description: z.string().max(1500).optional(),

  email: z.string().max(100).email({ message: "Email inválido." }).optional(),

  phone: z.string().max(20).optional(),

  googlePlaceId: z.string().max(80).optional(),

  multiLocation: z.boolean().optional(),

  website: z.string().max(100).optional(),

  address: z.string().max(100).optional(),

  cep: z.string().max(20).optional(),
  tipoatuacao: z.string().max(20),

  bairro: z.string().max(100).optional(),

  referencia: z.string().max(300).optional(),

  status: z.string().max(30).optional(),

  pass: z.string().optional(),

  cadastur: z.string().max(50).optional(),

  preco: z.string().max(10).optional(),

  instagram: z.string().max(100).optional(),
});

const validateAtracaoToCreate = (atracao) => {
  const schema = atracaoSchema.extend({
    cpfcnpj: z
      .string({ required_error: "CPF/CNPJ é obrigatório." })
      .min(11, { message: "CPF/CNPJ inválido." })
      .max(20, { message: "CPF/CNPJ inválido." }),
    pass: z
      .string({ required_error: "A senha é obrigatória." })
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
  });
  return schema.safeParse(atracao);
};

const validateAtracaoToUpdate = (atracao) => {
  const updateSchema = atracaoSchema.partial({
    pass: true,
    cpfcnpj: true,
  });
  return updateSchema.safeParse(atracao);
};

const validatePontoToCreate = (atracao) => {
  return atracaoSchema.safeParse(atracao);
};

const validateAtracaoToLogin = (atracao) => {
  const partial = atracaoSchema.partial({ id: true, name: true });
  return partial.safeParse(atracao);
};

const getAll = async () => {
  return prisma.atracao.findMany({
    select: {
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
        phone: true,
        website: true,
        address: true,
        multiLocation: true,
        status: true,
        imagens: true,
        cep: true,
        bairro: true,
        referencia: true,
        createdAt: true,
        cadastur: true,
        cpfcnpj: true,
        tipoatuacao: true,
        preco: true,
        googleRating: true,
        instagram: true,
        updatedAt: true,
        approvedAt: true,
        approvedBy: true,
        rejectionReason: true,
        subCategorias: {
          select: {
            id: true,
            subCategoria: true,
          },
        },
      },
    },
    where: {
      status: "ATIVO",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllPaginated = async ({ skip, take }) => {
  const whereClause = { status: "ATIVO" };
  const orderByClause = { createdAt: "desc" };

  const [atracoes, total] = await prisma.$transaction([
    prisma.atracao.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
        phone: true,
        website: true,
        address: true,
        multiLocation: true,
        googleRating: true,
        status: true,
        imagens: true,
        cep: true,
        bairro: true,
        referencia: true,
        createdAt: true,
        subCategorias: {
          select: {
            id: true,
            subCategoria: true,
          },
        },
      },
      where: whereClause,
      orderBy: orderByClause,
      skip: skip,
      take: take,
    }),

    prisma.atracao.count({
      where: whereClause,
    }),
  ]);

  return { atracoes, total };
};

const getAllPaginatedPanel = async ({ skip, take, guiaId }) => {
  const orderByClause = { createdAt: "desc" };
  const whereClause = { guiaId: guiaId };

  const [atracoes, total] = await prisma.$transaction([
    prisma.atracao.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
        phone: true,
        website: true,
        address: true,
        multiLocation: true,
        status: true,
        imagens: true,
        cep: true,
        bairro: true,
        referencia: true,
        createdAt: true,
        cadastur: true,
        cpfcnpj: true,
        tipoatuacao: true,
        preco: true,
        googleRating: true,
        instagram: true,
        updatedAt: true,
        approvedAt: true,
        approvedBy: true,
        rejectionReason: true,
        subCategorias: {
          select: {
            id: true,
            subCategoria: true,
          },
        },
      },
      orderBy: orderByClause,
      skip: skip,
      take: take,
    }),

    prisma.atracao.count({
      where: whereClause,
    }),
  ]);

  return { atracoes, total };
};
const categoryMap = {
  praias: "Praia",
  trilhas: "Trilhas",
  cachoeiras: "Cachoeiras",
  restaurantesBares: "Restaurantes e bares",
  centroCultural: "Centro cultural",
  turismoCultural: "Turismo cultural",
  esportes: "Turismo esportivo",
  ecoturismo: "Ecoturismo",
  geoturismo: "Geoturismo",
  shopping: "Shoppings, lojas e comércios",
  pontosTuristicos: "Pontos turísticos",
  turismoNautico: "Turismo náutico",
  culinariaRegional: "Culinária regional",
  fastFood: "Fast-food",
  sobremesas: "Sobremesas",
  comidaJaponesa: "Comida japonesa",
  comidaItaliana: "Comida italiana",
  comidaArabe: "Comida árabe",
  comidaMexicana: "Comida mexicana",
};

const buildWhereClause = (filters) => {
  const andConditions = [];

  andConditions.push({ status: "ATIVO" });

  if (filters.subcategorias) {
    let ids = filters.subcategorias;
    if (typeof ids === "string") {
      ids = ids
        .split(",")
        .map((s) => Number(s))
        .filter(Boolean);
    } else if (Array.isArray(ids)) {
      ids = ids.map((i) => Number(i)).filter(Boolean);
    }

    if (Array.isArray(ids) && ids.length > 0) {
      andConditions.push({
        subCategorias: {
          some: {
            subCategoria: {
              id: { in: ids },
            },
          },
        },
      });
    }
  }

  const activeCategoryFilters = [];

  Object.keys(filters).forEach((filterKey) => {
    const isFilterActive =
      filters[filterKey] === true || filters[filterKey] === "true";

    if (isFilterActive && categoryMap[filterKey]) {
      activeCategoryFilters.push(categoryMap[filterKey]);
    }
  });

  if (activeCategoryFilters.length > 0) {
    const orCategoryConditions = activeCategoryFilters.map((categoryName) => ({
      subCategorias: {
        some: {
          subCategoria: {
            name: {
              equals: categoryName,
              mode: "insensitive",
            },
          },
        },
      },
    }));

    andConditions.push({ OR: orCategoryConditions });
  }

  return { AND: andConditions };
};

const filterPaginated = async ({ filters, skip, take }) => {
  const where = buildWhereClause(filters);

  const [atracoes, total] = await prisma.$transaction([
    prisma.atracao.findMany({
      where,
      select: {
        id: true,
        name: true,
        cpfcnpj: true,
        description: true,
        email: true,
        phone: true,
        multiLocation: true,
        website: true,
        address: true,
        cep: true,
        googleRating: true,
        bairro: true,
        referencia: true,
        imagens: true,
        preco: true,
        instagram: true,
        status: true,
        subCategorias: {
          select: {
            id: true,
            subCategoria: true,
          },
        },
      },
      orderBy: { name: "asc" },
      skip: skip,
      take: take,
    }),

    prisma.atracao.count({
      where,
    }),
  ]);

  return { atracoes, total };
};

const filter = async (filters) => {
  const where = buildWhereClause(filters);

  const atracoesRaw = await prisma.atracao.findMany({
    where,
    select: {
      id: true,
      name: true,
      cpfcnpj: true,
      description: true,
      email: true,
      phone: true,
      multiLocation: true,
      website: true,
      address: true,
      cep: true,
      bairro: true,
      googleRating: true,
      referencia: true,
      preco: true,
      instagram: true,
      status: true,
      imagens: true,
      subCategorias: {
        select: {
          id: true,
          subCategoria: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return atracoesRaw.map((atracao) => ({
    ...atracao,
    subcategorias: atracao.subCategorias.map((pivo) => pivo.subCategoria),
  }));
};

const getById = async (id) => {
  return prisma.atracao.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      description: true,
      phone: true,
      website: true,
      address: true,
      multiLocation: true,
      status: true,
      imagens: true,
      cep: true,
      googleRating: true,
      bairro: true,
      referencia: true,
      createdAt: true,
      cadastur: true,
      cpfcnpj: true,
      tipoatuacao: true,
      preco: true,
      instagram: true,
      updatedAt: true,
      approvedAt: true,
      approvedBy: true,
      rejectionReason: true,
      subCategorias: {
        select: {
          id: true,
          subCategoria: true,
        },
      },
    },
  });
};

const getByEmail = async (email) => {
  return prisma.atracao.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, passHash: true },
  });
};

const confirmToken = async (token) => {
  const atracao = await prisma.atracao.findFirst({
    where: { confirmationToken: token, status: "PENDENTE" },
  });
  if (!atracao) return null;
  return prisma.atracao.update({
    where: { id: atracao.id },
    data: { status: "ATIVO", confirmationToken: null },
  });
};

const getByPhone = async (phone) => {
  return prisma.atracao.findUnique({
    where: { phone },
    select: { id: true, name: true, phone: true, passHash: true },
  });
};

const create = async (data) => {
  const { categorias, ...resto } = data;

  return prisma.atracao.create({
    data: {
      ...resto,
      subCategorias: {
        create: categorias.map((subCategoriaId) => ({
          subCategoria: { connect: { id: subCategoriaId } },
        })),
      },
    },
    include: {
      subCategorias: {
        include: { subCategoria: { include: { categoria: true } } },
      },
    },
  });
};

const remove = async (id) => {
  return prisma.atracao.delete({
    where: { id },
    select: { id: true, name: true, email: true },
  });
};

const update = async (id, data) => {
  const { categorias, ...resto } = data;

  return prisma.atracao.update({
    where: { id },
    data: {
      ...resto,
      subCategorias: {
        deleteMany: {},
        create: categorias.map((subCategoriaId) => ({
          subCategoria: { connect: { id: subCategoriaId } },
        })),
      },
    },
    include: {
      subCategorias: {
        include: { subCategoria: { include: { categoria: true } } },
      },
    },
  });
};

const updatePass = async (atracaoId, newPassHash) => {
  return prisma.atracao.update({
    where: { id: atracaoId },
    data: { passHash: newPassHash },
  });
};

export default {
  getAll,
  getAllPaginated,
  getById,
  getByEmail,
  getByPhone,
  create,
  remove,
  update,
  updatePass,
  confirmToken,
  validateAtracaoToCreate,
  validateAtracaoToUpdate,
  validateAtracaoToLogin,
  validatePontoToCreate,
  getAllPaginatedPanel,
  filter,
  filterPaginated,
};
