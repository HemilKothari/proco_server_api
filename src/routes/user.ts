import { Router } from "express";
import { updateUser, deleteUser, getUser, getAllUsers } from "../controllers/userController";
import { verifyTokenAndAuthorization, verifyTokenAndAdmin } from "../middleware/verifyToken";


const userRouter = Router();

// UPADATE USER
userRouter.put("/", verifyTokenAndAuthorization, updateUser);

// DELETE USER

userRouter.delete("/", verifyTokenAndAuthorization, deleteUser);

// GET USER

userRouter.get("/", verifyTokenAndAuthorization, getUser);

// GET ALL USER

userRouter.get("/all", verifyTokenAndAdmin, getAllUsers);

export  {userRouter};
