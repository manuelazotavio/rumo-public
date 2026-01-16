import express from "express";
import { createAtracao } from "../controllers/atracoes/create.js";
import list from '../controllers/atracoes/listAll.js';
import updateAtracao from "../controllers/atracoes/update.js";
import listAllPanel from "../controllers/atracoes/listAllPanel.js";
import { getById } from '../controllers/atracoes/getById.js';
import { filterAtracoes } from '../controllers/atracoes/filter.js';
import { confirmAtracao } from '../controllers/atracoes/confirmToken.js';
import { removeAtracao } from '../controllers/atracoes/removeAtracao.js';
import create from '../controllers/imagens/create.js';
import listImagens from '../controllers/imagens/listAll.js'
import { upload } from '../middlewares/multer.js';
import deleteImagem from '../controllers/imagens/remove.js';
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth, createAtracao);
router.get("/", list);
router.get("/panel", auth, listAllPanel);
router.get("/confirm/:token", confirmAtracao)
router.get("/filter", filterAtracoes);
router.get("/:id", getById);
router.delete("/:id", removeAtracao);
router.put("/:id", updateAtracao);
router.post("/:atracaoId/imagens", upload.array("imagem"), create);
router.get("/:atracaoId/imagens", listImagens)
router.delete("/:atracaoId/imagens/:imagemId", deleteImagem)

export default router;