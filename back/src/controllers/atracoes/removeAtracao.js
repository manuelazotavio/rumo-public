import atracaoModel from "../../models/atracaoModel.js";

export const removeAtracao = async (req, res) => {
  try {
    const id = +req.params.id;

    const result = await atracaoModel.remove(+id);
    res.json({
      success: `Atracao ${id} apagada com sucesso!`,
      atracao: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Opsss erro no servidor, tente novamente!",
    });
  }
};
