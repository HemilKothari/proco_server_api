const Chat = require("../models/Chat");
const User = require("../models/User");

// ======================== ACCESS OR CREATE CHAT ========================
const accessChat = async (req, res) => {
  const { user_id } = req.body;
  console.log("Req Body", req.body);

  if (!user_id)
    return res.status(400).json({ message: "user_id not provided" });

  try {
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user.id, user_id] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, user_id],
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );
    res.status(200).json(fullChat);
  } catch (error) {
    res.status(500).json({ message: "Error accessing chat", error });
  }
};

// ======================== FETCH ALL USER CHATS ========================
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};

// ======================== CREATE GROUP CHAT ========================
const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please provide users and name" });
  }

  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).json({ message: "Group chat requires 2+ users" });
  }

  users.push(req.user.id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: "Error creating group chat", error });
  }
};

module.exports = {
  accessChat,
  getChats,
  createGroupChat,
};
