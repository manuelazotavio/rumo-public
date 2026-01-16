import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImagensAtracao = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "Nenhuma imagem enviada" });

    const imagens = [];

    for (const file of req.files) {
      const filePath = `/uploads/atracoes/${file.filename}`;
      imagens.push({
        id_atracao: id,
        caminho: filePath,
      });

    }

    await db("atracao_imagens").insert(imagens);

    res.status(201).json({ sucesso: true, imagens });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao enviar imagens" });
  }
};
