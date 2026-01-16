import { v4 as uuidv4 } from 'uuid';
import atracaoModel from "../../models/atracaoModel.js";
import nodemailer from "nodemailer";
// import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from "../../config/config.js";

const requestClaimEmpresa = async (req, res) => {
  try {
    const { atracaoId } = req.body;

    if (!atracaoId) {
      return res.status(400).json({
        error: "ID da atração é obrigatório"
      });
    }

    const atracao = await atracaoModel.getById(atracaoId);
    if (!atracao) {
      return res.status(404).json({
        error: "Atração não encontrada"
      });
    }

    // Gera token único para confirmação
    const confirmationToken = uuidv4();
    
    // Atualiza atração com token (reusa campo existente)
    await atracaoModel.edit({
      id: atracao.id,
      confirmationToken
    });

    // // Configura transportador de email
    // const transporter = nodemailer.createTransport({
    //   host: SMTP_HOST,
    //   port: SMTP_PORT,
    //   secure: true,
    //   auth: {
    //     user: SMTP_USER,
    //     pass: SMTP_PASS
    //   }
    // });

    // // Monta link de confirmação
    // const confirmUrl = `${process.env.FRONT_URL || 'http://localhost:3000'}/atracoes/confirm/${confirmationToken}`;

    // // Template do email
    // const mailOptions = {
    //   from: SMTP_USER,
    //   to: atracao.email,
    //   subject: 'Confirme a reivindicação do seu negócio no Caraguatatour',
    //   html: `
    //     <h2>Olá ${atracao.name}!</h2>
    //     <p>Recebemos uma solicitação para reivindicar seu negócio no Caraguatatour.</p>
    //     <p>Para confirmar que você é o proprietário/responsável e criar sua senha de acesso, clique no link abaixo:</p>
    //     <p>
    //       <a href="${confirmUrl}" style="padding: 12px 24px; background: #008080; color: white; text-decoration: none; border-radius: 4px;">
    //         Confirmar reivindicação
    //       </a>
    //     </p>
    //     <p>Ou acesse: ${confirmUrl}</p>
    //     <p>Este link é válido por 24 horas.</p>
    //     <p>Se você não solicitou esta reivindicação, pode ignorar este email.</p>
    //     <br>
    //     <p>Atenciosamente,<br>Equipe Caraguatatour</p>
    //   `
    // };

    // // Envia email
    // await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Email de confirmação enviado com sucesso"
    });

  } catch (error) {
    console.error('Erro ao solicitar reivindicação:', error);
    return res.status(500).json({
      error: "Erro ao processar solicitação. Tente novamente mais tarde."
    });
  }
};

export default requestClaimEmpresa;