const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User = require("../models/User");

// ======================== SEND MESSAGE ========================
const sendMessage = async (req, res) => {
  const { content, chatId, receiver } = req.body;

  if (!content || !chatId || !receiver) {
    return res
      .status(400)
      .json({ message: "Content, chatId, and receiver are required" });
  }

  try {
    const newMessage = await Message.create({
      sender: req.user.id,
      receiver,
      content,
      chat: chatId,
    });

    // Populate the message details
    let populatedMsg = await newMessage.populate(
      "sender",
      "username profile email"
    );
    populatedMsg = await populatedMsg.populate("chat");
    populatedMsg = await User.populate(populatedMsg, {
      path: "chat.users",
      select: "username profile email",
    });

    // Update chat’s latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

    res.status(200).json(populatedMsg);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ======================== GET MESSAGES FOR CHAT ========================
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username profile email")
      .populate("receiver", "username profile email")
      .populate("chat");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ======================== MARK MESSAGES AS READ ========================
const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Mark all messages in this chat as read by the current user
    await Message.updateMany(
      { chat: chatId, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ======================== GET ALL MESSAGES ========================
const allMessages = async (req, res) => {
  try {
    const pageSize = 12; // Number of messages per page
    const page = req.query.page || 1; // Current page number

    // Calculate the number of messages to skip
    const skipMessages = (page - 1) * pageSize;

    // Find messages with pagination
    var messages = await Message.find({ chat: req.params.id })
      .populate("sender", "username profile email")
      .populate("chat")
      .sort({ createdAt: -1 }) // Sort messages by descending createdAt
      .skip(skipMessages) // Skip the messages based on pagination
      .limit(pageSize); // Limit the number of messages per page

    messages = await User.populate(messages, {
      path: "chat.users",
      select: "username profile email",
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json("Could not get chats");
  }
};

// ======================== EXPORTS ========================
module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  allMessages,
};
