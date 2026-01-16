import atracaoModel from "../../models/atracaoModel.js";
import zodErrorFormat from "../../helpers/zodErrorFormat.js";

const update = async (req, res) => {
  try {
    const mappedData = {
      name: req.body.name,
      cpfcnpj: req.body.cpfcnpj || req.body.cpf || req.body.cnpj || "",
      email: req.body.email,
      categorias: req.body.subcategorias || req.body.categorias,
      description: req.body.descricao,
      phone: req.body.phone,
      number: req.body.numero,
      multiLocation: req.body.multiLocation,
      address: req.body.endereco,
      cep: req.body.cep,
      status: req.body.status,
      bairro: req.body.bairro,
      referencia: req.body.referencia,
      website: req.body.site,
      cadastur: req.body.cadastur,
      tipoatuacao: req.body.tipoatuacao,
    };

    if (req.fileUrl) {
      mappedData.avatar = req.fileUrl;
    }

    const id = +req.params.id;
    const atracao = { ...mappedData };

    const result = atracaoModel.validateAtracaoToUpdate(atracao);
    if (!result.success) {
      return res.status(400).json({
        error: `Dados de Atualização Inválido`,
        fields: zodErrorFormat(result.error),
      });
    }
    const atracaoEdited = await atracaoModel.update(id, atracao);
    res.json({
      success: `Atração ${atracaoEdited.id} editada com sucesso!`,
      atracao: atracaoEdited,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Opsss erro no servidor, tente novamente!",
    });
  }
};

export default update;
