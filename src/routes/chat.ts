const express = require("express");
const {
  accessChat,
  getChats,
  createGroupChat,
} = require("../controllers/chatController");
const chatRouter = express.Router();

chatRouter.post("/", accessChat);
chatRouter.get("/", getChats);
chatRouter.post("/group", createGroupChat);

export { chatRouter};
