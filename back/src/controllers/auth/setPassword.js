import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";

export const setPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    if (!email || !password || !token) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    const guia = await prisma.guia.findUnique({
      where: { email },
    });

    if (!guia) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (guia.resetToken !== token) {
      return res.status(401).json({ error: "Token inválido ou expirado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await prisma.guia.update({
      where: { email },
      data: {
        passHash: hash,
        resetToken: null, 
      },
    });

    return res.status(200).json({ success: true, message: "Senha definida com sucesso." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno." });
  }
};