import userModel from "../../models/userModel.js";
import zodErrorFormat from "../../helpers/zodErrorFormat.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY, TOKEN_EXPIRES_IN } from "../../config/config.js";
import sessionModel from "../../models/sessionUserModel.js";

const loginUser = async (req, res) => {
  try {
    const { info, pass } = req.body;
    let email = null;
    let phone = null;
    if (info && info.includes("@")) {
      email = info;
    } else {
      phone = info;
    }

    if (!email && !phone) {
      return res.status(400).json({
        error: "Email ou phone inválido.",
      });
    }
    const result = userModel.validateUserToLogin({ info, pass });

    if (!result.success) {
      return res.status(400).json({
        error: `Dados inválidos`,
        fields: zodErrorFormat(result.error),
      });
    }

    let userFound;

    if (email) {
      userFound = await userModel.getByEmail(email);

      if (!userFound) {
        return res.status(400).json({
          error: `E-mail, celular ou senha inválidos.`,
        });
      }
    }

    if (phone) {
      userFound = await userModel.getByPhone(phone);
      if (!userFound) {
        return res.status(400).json({
          error: `E-mail, celular ou senha inválidos.`,
        });
      }
    }

    const passIsValid = await bcrypt.compare(pass, userFound.pass);

    if (!passIsValid) {
      return res.status(401).json({
        error: `Email ou senha inválida`,
      });
    }

    const token = jwt.sign(
      {
        id: userFound.id,
        name: userFound.name,
        guiaId: userFound.guiaId,
        admin: userFound.admin
      },
      SECRET_KEY,
      {
        expiresIn: TOKEN_EXPIRES_IN,
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    let date = new Date();
    date.setHours(date.getHours() - 3);

    await sessionModel.create({
      userId: userFound.id,
      token,
      createdAt: date,
    });

    return res.json({
      message: "User Logado!",
      token,
      user: {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
        admin: userFound.admin,
        guia: userFound.guia,
        guiaId: userFound.guiaId,
        image: userFound.image,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Opsss erro no servidor, tente novamente!",
    });
  }
};

export default loginUser;