import roteiroModel from "../../models/roteiroModel.js";


const listAll = async (req, res) => {
  try {
    const userId = +req.params.userId
    const roteiros = await roteiroModel.getByUser(userId);
    return res.json({
      success: "Roteiros listados com sucesso!",
      roteiros,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Opsss erro no servidor, tente novamente!",
    });
  }
};

export default listAll;
