import { Router } from "express";
import { sendMessage, getMessages, allMessages } from "../controllers/messageController";
import { verifyTokenAndAuthorization } from "../middleware/verifyToken";

const messageRouter = Router();

messageRouter.post("/",verifyTokenAndAuthorization, sendMessage);
messageRouter.get("/:chatId",verifyTokenAndAuthorization, getMessages);
messageRouter.get("/all/:id", allMessages);

export  {messageRouter};
