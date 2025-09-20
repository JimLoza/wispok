import express, { Request, Response } from "express";
import "dotenv/config";
import dbConnection from './config/mongo.config';

const app = express();

app.use(express.json());
dbConnection().then(() => console.log("Database connected"));


app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "payments-api", timestamp: new Date().toISOString() });
});



export default app;
