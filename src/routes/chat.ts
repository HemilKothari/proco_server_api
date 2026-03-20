import { verifyTokenAndAuthorization } from "../middleware/verifyToken";

const express = require("express");
const {
  accessChat,
  getChats,
  createGroupChat,
} = require("../controllers/chatController");
const chatRouter = express.Router();

chatRouter.post("/",verifyTokenAndAuthorization, accessChat);
chatRouter.get("/",verifyTokenAndAuthorization, getChats);
chatRouter.post("/group",verifyTokenAndAuthorization, createGroupChat);

export { chatRouter};
