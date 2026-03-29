import { Router } from "express";
import { updateUser, deleteUser, getUser, getAllUsers } from "../controllers/userController";
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization} from "../middleware/verifyToken";
import upload from "../middleware/multer";


const userRouter = Router();

// GET USER
userRouter.get("/",verifyTokenAndAuthorization, getUser);

// UPADATE USER
userRouter.put("/update",verifyToken, upload.single("profile"),updateUser);

// DELETE USER
userRouter.delete("/", verifyTokenAndAuthorization, deleteUser);

// GET ALL USER
userRouter.get("/all",verifyTokenAndAdmin, getAllUsers);

export  {userRouter};
