const express = require("express");
const {
  sendMessage,
  getMessages,
  allMessages,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/", sendMessage);
router.get("/:chatId", getMessages);
router.get("/all/:id", allMessages);

export  router;
