import { Router } from "express";
import { createUser, loginUser } from "../controllers/authContoller";

const authRouter = Router()

// REGISTRATION
authRouter.post("/register", createUser);

// LOGIN
authRouter.post("/login", loginUser);

export { authRouter};
