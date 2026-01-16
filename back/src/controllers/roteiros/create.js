import prisma from "../../config/prisma.js"; 
import roteiroModel from "../../models/roteiroModel.js";
import zodErrorFormat from "../../helpers/zodErrorFormat.js";

const createRoteiro = async (req, res) => {
  try {
    const { name, secret, userIds } = req.body;

    const roteiroData = { name, secret: Number(secret) };
    const result = roteiroModel.validateRoteiroToCreate(roteiroData);

    if (!result.success) {
      return res.status(400).json({
        error: `Erro ao criar roteiro`,
        fields: zodErrorFormat(result.error),
      });
    }

    let usersConnect = [];
    if (userIds && Array.isArray(userIds)) {
      usersConnect = userIds.map((id) => ({ id: parseInt(id) }));
    }

    const dataToCreate = {
      ...result.data,
      users: {
        connect: usersConnect
      }
    };

    const newRoteiro = await prisma.roteiro.create({
      data: dataToCreate
    });

    return res.json({
      success: `Roteiro ${newRoteiro.id} criado com sucesso!`,
      roteiro: newRoteiro,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Opsss erro no servidor, tente novamente!",
    });
  }
};

export default createRoteiro;