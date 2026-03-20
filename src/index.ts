import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { router } from "./routes";
import setupSocket from "./socket/socket";
import http from "http";

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
const PORT: number = Number(process.env.PORT) || 3000;

// 🔥 CREATE HTTP SERVER
const server = http.createServer(app);

// 🔥 ATTACH SOCKET
setupSocket(server);

// 🔥 START SERVER
server.listen(PORT, () => {
  console.log(`Server + Socket running on port ${PORT}`);
});