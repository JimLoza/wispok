import express, { Request, Response } from "express";
import "dotenv/config";
import dbConnection from './config/database/mongo.config';
import router from './components/index.routes';

const app = express();

app.use(express.json());
dbConnection().then(() => console.log("Database connected"));


app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "payments-api", timestamp: new Date().toISOString() });
});


app.use("/api", router);

export default app;
