import prisma from "../config/prisma.js";
import { z } from "zod";

const userSchema = z.object({
  id: z.number({
    required_error: "ID é obrigatório.",
    invalid_type_error: "O ID deve ser um número inteiro.",
  }),
  name: z
    .string({
      required_error: "Nome é obrigatório.",
      invalid_type_error: "O nome deve ser uma string.",
    })
    .min(3, { message: "O nome deve ter no mínimo 3 letras." })
    .max(200, { message: "O nome deve ter no máximo 200 caracteres." }),
  email: z
    .string({
      invalid_type_error: "O email ou celular deve ser uma string.",
    })
    .max(500, { message: "O email deve ter no máximo 500 caracteres." })
    .optional(),
  phone: z
    .string({
      invalid_type_error: "O email ou celular deve ser uma string.",
    })
    .max(500, { message: "O celular deve ter no máximo 500 caracteres." })
    .optional(),
  pass: z
    .string({
      required_error: "A senha é obrigatória.",
      invalid_type_error: "A senha deve ser uma string.",
    })
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

const passwordSchema = z.object({
  pass: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

const validateUserToCreate = (user) => {
  const partialUserSchema = userSchema.partial({ id: true });
  return partialUserSchema.safeParse(user);
};

const validateUserToUpdate = (user) => {
  const partialUserSchema = userSchema.partial({ pass: true });
  return partialUserSchema.safeParse(user);
};

const validateUserToLogin = (user) => {
  const partialUserSchema = userSchema.partial({
    id: true,
    name: true,
  });
  return partialUserSchema.safeParse(user);
};

const validatePassword = (data) => {
  return passwordSchema.safeParse(data);
};

const getAll = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

const getById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      pass: true,
    },
  });
};

const getByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      pass: true,
      admin: true,
      guia: true,
      guiaId: true,
    },
  });

  if (user && user.guiaId) {
    const dadosGuia = await prisma.guia.findUnique({
      where: { id: user.guiaId },
      select: { image: true },
    });

    return {
      ...user,
      image: dadosGuia?.image || null,
    };
  }

  return user;
};

const getByPhone = async (phone) => {
  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      pass: true,
      admin: true,
      guia: true,
      guiaId: true,
    },
  });

  if (user && user.guiaId) {
    const dadosGuia = await prisma.guia.findUnique({
      where: { id: user.guiaId },
      select: { image: true },
    });

    return {
      ...user,
      image: dadosGuia?.image || null,
    };
  }

  return user;
};

const create = async (user) => {
  return await prisma.user.create({
    data: user,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
};

const getByResetToken = async (token) => {
  return await prisma.user.findFirst({
    where: { resetPasswordToken: token },
  });
};

const remove = async (id) => {
  return await prisma.user.delete({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
};

const update = async (user) => {
  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: user,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
};

const updatePass = async (userId, newPassword) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { pass: newPassword },
  });
};

export default {
  getAll,
  getById,
  getByPhone,
  getByResetToken,
  updatePass,
  getByEmail,
  create,
  remove,
  update,
  validatePassword,
  validateUserToCreate,
  validateUserToUpdate,
  validateUserToLogin,
};
