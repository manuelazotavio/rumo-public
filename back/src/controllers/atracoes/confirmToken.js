import atracaoModel from "../../models/atracaoModel.js";


export const confirmAtracao = async (req, res) => {
  try {
  const { token } = req.params
  const updated = await atracaoModel.confirmToken(token)
  
  if (!updated) return res.status(400).json({ error: "Token inválido ou já confirmado" })
  res.json({ success: true, atracao: updated })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Opsss erro no servidor, tente novamente!",
    });
  }
};

