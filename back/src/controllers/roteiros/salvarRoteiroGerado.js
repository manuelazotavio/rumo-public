import prisma from "../../config/prisma.js";

export const salvarRoteiroGerado = async (req, res) => {
  try {
    const { userId, name, atracoes } = req.body;

    if (!userId || !atracoes || atracoes.length === 0) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    const novoRoteiro = await prisma.roteiro.create({
      data: {
        name: name || "Roteiro Automático",
        users: {
          connect: { id: parseInt(userId) }
        },
        vinculaRoteiro: {
          create: atracoes.map((atracao) => ({
            atracao: {
              connect: { id: atracao.id }
            }
          }))
        }
      },
      include: {
        vinculaRoteiro: {
          include: {
            atracao: true
          }
        }
      }
    });

    return res.status(201).json(novoRoteiro);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao salvar roteiro." });
  }
};