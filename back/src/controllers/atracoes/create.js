import "dotenv/config";
import axios from "axios";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import atracaoModel from "../../models/atracaoModel.js";
import zodErrorFormat from "../../helpers/zodErrorFormat.js";
import bcrypt from "bcrypt";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const createAtracao = async (req, res) => {
  try {
   
    const guiaId = req.userLogged?.guiaId;

    const tipo = req.body.tipoatuacao
      ? String(req.body.tipoatuacao).toLowerCase()
      : "";

    const googlePlaceIdInput = req.body.googleID || req.body.placeID;
  

    const isCNPJ =
      !!req.body.cnpj && tipo !== "ponto" && !tipo.includes("ponto");
    let adminEmail;

    if (isCNPJ) {
      const cnpj = req.body.cnpj.replace(/\D/g, "");
      const resp = await axios.get(
        `https://www.receitaws.com.br/v1/cnpj/${cnpj}`
      );
      if (resp.data.status === "ERROR" || !resp.data.email) {
        return res
          .status(400)
          .json({ error: "CNPJ inválido ou sem email administrativo" });
      }
      adminEmail = resp.data.email;
      const jaExiste = await atracaoModel.getByEmail(adminEmail);
      if (jaExiste) {
        return res.status(400).json({ error: "Já existe cadastro pendente." });
      }
    }

    const mappedData = {
      name: req.body.name,
      cpfcnpj: req.body.cpfcnpj || req.body.cpf || req.body.cnpj || "",
      email: adminEmail ? adminEmail : req.body.email,
      categorias: req.body.subcategorias || req.body.categorias,
      description: req.body.descricao,
      phone: req.body.phone,
      number: req.body.numero,
      multiLocation:
        req.body.multiLocation === "true" || req.body.multiLocation === true,
      address: req.body.endereco,
      cep: req.body.cep,
      bairro: req.body.bairro,
      referencia: req.body.referencia,
      website: req.body.site,
      cadastur: req.body.cadastur,
      pass: req.body.senha,
      tipoatuacao: req.body.tipoatuacao,
      googlePlaceId: googlePlaceIdInput,
    };

    Object.keys(mappedData).forEach((key) => {
      if (mappedData[key] === null || mappedData[key] === undefined) {
        delete mappedData[key];
      }
    });

    let result = "";
    if (tipo.includes("ponto")) {
      result = atracaoModel.validatePontoToCreate(mappedData);
    } else {
      result = atracaoModel.validateAtracaoToCreate(mappedData);
    }

    if (!result.success) {
     
      return res.status(400).json({
        error: `Dados inválidos. {${zodErrorFormat(result.error)}}`,
        fields: zodErrorFormat(result.error),
      });
    }

    const { pass, ...dto } = result.data;
    let finalPass = pass;
    let confirmationToken = null;
    let status = "PENDENTE";

    if (tipo.includes("ponto") || tipo.includes("turistico")) {
      if (!finalPass) finalPass = crypto.randomBytes(8).toString("hex");
      status = "ATIVO";
    } else {
      confirmationToken = isCNPJ
        ? crypto.randomBytes(32).toString("hex")
        : null;
      status = "PENDENTE";
    }

    const passHash = await bcrypt.hash(finalPass, 10);

    let googleData = {};

    if (googlePlaceIdInput) {
      
      try {
        const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceIdInput}&fields=rating,user_ratings_total&language=pt-BR&key=${GOOGLE_API_KEY}`;

        const response = await axios.get(url);

      

        if (response.data.status === "OK") {
          const resultGoogle = response.data.result;
          googleData = {
            googlePlaceId: googlePlaceIdInput,
            googleRating: resultGoogle.rating,
            googleUserRatingsTotal: resultGoogle.user_ratings_total,
            lastGoogleUpdate: new Date(),
          };
          
        } else {
          console.warn(
            "--> Google API retornou erro:",
            response.data.error_message || response.data.status
          );
        }
      } catch (err) {
        console.error("--> ERRO CRÍTICO NA REQUISIÇÃO GOOGLE:", err.message);
      }
    }

    const newAtracao = await atracaoModel.create({
      ...dto,
      guiaId: guiaId ? Number(guiaId) : null,
      passHash,
      status,
      confirmationToken,
      ...googleData,
    });

    if (isCNPJ) {
      await sgMail.send({
        to: adminEmail,
        from: "caraguatatour@gmail.com",
        subject: "Confirme seu cadastro",
        html: `<p>Para confirmar seu cadastro, clique <a href="${process.env.APP_URL}/atracoes/confirm/${confirmationToken}">aqui</a>.</p>`,
      });
      return res.status(201).json({
        success: true,
        message: `Cadastro pendente. Email enviado para ${adminEmail}.`,
        atracao: newAtracao,
      });
    }

    return res.status(201).json({
      success: true,
      tipoatuacao: newAtracao.tipoatuacao,
      message: `Atração criada! Nota Google: ${
        googleData.googleRating || "N/A"
      }`,
      atracao: newAtracao,
      id: newAtracao.id
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "Já existe um cadastro com esse CPF/CNPJ ou e-mail." });
    }
    console.log(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
