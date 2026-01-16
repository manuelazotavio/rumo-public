import atracaoModel from "../../models/atracaoModel.js";

export const filterAtracoes = async (req, res) => {
  try {
    const atracoes = await atracaoModel.filter(req.query);
    
    res.json({
      success: true,
      atracoes: atracoes,
      total: atracoes.length,
    });

  } catch (err) {
    console.error("Erro ao filtrar atrações:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao filtrar atrações",
      details: err.message,
    });
  }
};
