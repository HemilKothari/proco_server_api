import Chat from "../models/Chat";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";

// ======================== ACCESS OR CREATE CHAT ========================
export const accessChat = async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  console.log("Req Body", req.body);

  if (!userId)
    return errorResponse(res, "userId is required", 400);

  try {
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user.id as string, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) {
      return successResponse(res, chat, "Chat accessed successfully", 200);
    }

    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );
    successResponse(res, fullChat, "Chat created successfully", 200);
  } catch (error) {
    errorResponse(res, "Error creating chat", 500);
  }
};

// ======================== FETCH ALL USER CHATS ========================
export const getChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    // ✅ Check if no chats exist
    if (!chats || chats.length === 0) {
      return successResponse(
        res,
        [],
        "No chats found",
        200
      );
    }

    return successResponse(
      res,
      chats,
      "Chats fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching chats:", error);
    return errorResponse(res, "Error fetching chats", 500);
  }
};

// ======================== CREATE GROUP CHAT ========================
export const createGroupChat = async (req: Request, res: Response) => {
  if (!req.body.users || !req.body.name) {
    return errorResponse(res, "Please provide users and name", 400);
  }

  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return errorResponse(res, "Group chat requires 2+ users", 400);
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

    successResponse(res, fullGroupChat, "Group chat created successfully", 200);
  } catch (error) {
    errorResponse(res, "Error creating group chat", 500);
  }
};


