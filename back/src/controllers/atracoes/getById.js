
import atracaoModel from "../../models/atracaoModel.js";

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "ID é obrigatório"
      });
    }

    const atracao = await atracaoModel.getById(parseInt(id));
    
    if (!atracao) {
      return res.status(404).json({
        success: false,
        error: "Atração não encontrada"
      });
    }

    return res.json({
      success: true,
      atracao
    });
  } catch (err) {
    console.error("Erro ao buscar atração:", err);
    return res.status(500).json({
      success: false,
      error: "Erro interno ao buscar atração.",
      details: err.message
    });
  }
};