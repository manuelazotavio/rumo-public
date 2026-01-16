
import roteiroModel from "../../models/roteiroModel.js";

export const getAtracoesRoteiro = async (req, res) => {
  try {
    const { roteiroId } = req.params;
    
    if (!roteiroId) {
      return res.status(400).json({
        success: false,
        error: "ID do roteiro é obrigatório"
      });
    }

    const atracoes = await roteiroModel.getAtracoesRoteiro(parseInt(roteiroId));
    
    if (!atracoes) {
      return res.status(404).json({
        success: false,
        error: "Este roteiro não possui nenhuma atração."
      });
    }

    return res.json({
      success: true,
      atracoes
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