import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config.js";

const auth = (req, res, next) => {
  let token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Usuário não autenticado",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.userLogged = {
      id: decoded.id,
      name: decoded.name,
      guiaId: decoded.guiaId,
      admin: decoded.admin,
      token: token,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expirado.",
        code: "expired-token",
      });
    }
    return res.status(401).json({
      error: "Token Inválido.",
      code: "invalid-token",
    });
  }
};

export default auth;
