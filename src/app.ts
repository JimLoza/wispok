import express, { Request, Response } from "express";
import "dotenv/config";
import dbConnection from './config/database/mongo.config';
import router from './components/index.routes';
import cors from 'cors';
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos en milisegundos
  max: 100,
  message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo después de 15 minutos.'
});

app.use(express.json());
app.use(cors({
  origin: '*',
}))
app.use(helmet())
app.use(apiLimiter);


dbConnection().then(() => console.log("Database connected"));


app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "payments-api", timestamp: new Date().toISOString() });
});


app.use("/api", router);

export default app;
