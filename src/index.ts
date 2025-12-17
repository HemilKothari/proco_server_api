import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db";
import { router } from "./routes";


const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

var port = process.env.PORT || 4000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
