import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../routers/userRouter.js";
import authRouter from "../routers/authRouter.js";
import guideRouter from "../routers/guideRouter.js";
import roteiroRouter from "../routers/roteiroRouter.js";
import atracaoRouter from "../routers/atracaoRouter.js";
import eventRouter from '../routers/eventRouter.js'
import categoriaRouter from "../routers/categoriaRouter.js";
import dashboardRouter from "../routers/dashboardRouter.js";
import newsletterRouter from '../routers/newsletterRouter.js'
import financeiroRouter from '../routers/financeiroRouter.js'
import passeioRouter from "../routers/passeioRouter.js";
import logsRouter from "../routers/logsRouter.js"
import avaliacaoRouter from '../routers/avaliacaoRouter.js'

const PORT = 3001;
const HOST = '0.0.0.0';


const app = express();

const allowedOrigins = [
  'https://rumo-six.vercel.app',
  'https://rumoviagens.com.br',
  'https://www.rumoviagens.com.br',
  'https://rumo.com.pl',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/atracoes", atracaoRouter);


app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
