import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { router } from "./routes";

// ======================== ENV ========================
dotenv.config();

// ======================== APP ========================
const app: Application = express();

// ======================== DATABASE ========================
connectDB();

// ======================== MIDDLEWARE ========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================== ROUTES ========================
app.use("/", router);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

// ======================== SERVER ========================
const PORT: number = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});