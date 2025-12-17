const express = require("express");
const {
  accessChat,
  getChats,
  createGroupChat,
} = require("../controllers/chatController");
const router = express.Router();

router.post("/", accessChat);
router.get("/", getChats);
router.post("/group", createGroupChat);

module.exports = router;
