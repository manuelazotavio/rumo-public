import roteiroModel from "../../models/roteiroModel.js";

const remove = async (req, res) => {
  try {
    const id = +req.params.id;

    const result = await roteiroModel.remove(+id);
    res.json({
      success: `Roteiro ${id} apagado com sucesso!`,
      roteiro: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Opsss erro no servidor, tente novamente!",
    });
  }
};

export default remove;
