import roteiroModel from "../../models/roteiroModel.js";


const getRecente = async (req, res) => {
  try {
    const userId = +req.params.userId;

    const roteiro = await roteiroModel.getRecente(userId);
    return res.json({
      success: "Roteiros listados com sucesso!",
      roteiro,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Opsss erro no servidor, tente novamente!",
    });
  }
};

export default getRecente;
