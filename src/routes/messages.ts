import { Router } from "express";
import { sendMessage, getMessages, allMessages } from "../controllers/messageController";

const messageRouter = Router();

messageRouter.post("/", sendMessage);
messageRouter.get("/:chatId", getMessages);
messageRouter.get("/all/:id", allMessages);

export  {messageRouter};
