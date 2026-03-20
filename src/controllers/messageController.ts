import { Request, Response } from "express";
import { Types } from "mongoose";
import Message from "../models/Message";
import Chat from "../models/Chat";
import User from "../models/User";
import {
  SendMessageBody,
  AuthenticatedRequest,
  PaginationQuery,
} from "../types";
import { errorResponse, successResponse } from "../utils/response";

// ======================== SEND MESSAGE ========================
export const sendMessage = async (
  req: AuthenticatedRequest<{}, {}, SendMessageBody>,
  res: Response
): Promise<Response> => {
  const { content, chatId, receiver } = req.body;

  if (!content || !chatId || !receiver) {
    
    return errorResponse(res, "Content, chatId, and receiver are required", 400);
  }

  try {
    const newMessage = await Message.create({
      sender: new Types.ObjectId(req.user.id),
      receiver: new Types.ObjectId(receiver),
      content,
      chat: new Types.ObjectId(chatId),
    });

    let populatedMsg = await newMessage.populate(
      "sender",
      "username profile email"
    );

    populatedMsg = await populatedMsg.populate("chat");

    populatedMsg = await User.populate(populatedMsg, {
      path: "chat.users",
      select: "username profile email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: newMessage._id,
    });

    return successResponse(res, populatedMsg, "Message sent successfully", 201);
  } catch (error: unknown) {
    console.error("Error sending message:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== GET MESSAGES FOR CHAT ========================
export const getMessages = async (
  req: Request<{ chatId: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { chatId } = req.params;

    if (!Types.ObjectId.isValid(chatId)) {
      return errorResponse(res, "Invalid chatId", 400);
    }

    const messages = await Message.find({
      chat: new Types.ObjectId(chatId),
    })
      .populate("sender", "username profile email")
      .populate("receiver", "username profile email")
      .populate("chat");

    return successResponse(res, messages, "Messages retrieved successfully", 200);
  } catch (error: unknown) {
    console.error("Error fetching messages:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== MARK MESSAGES AS READ ========================
export const markAsRead = async (
  req: AuthenticatedRequest<{ chatId: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    if (!Types.ObjectId.isValid(chatId)) {
      return errorResponse(res, "Invalid chatId", 400);
    }

    await Message.updateMany(
      {
        chat: new Types.ObjectId(chatId),
        readBy: { $ne: new Types.ObjectId(userId) },
      },
      {
        $addToSet: { readBy: new Types.ObjectId(userId) },
      }
    );

    return successResponse(res, {}, "Messages marked as read", 200);
  } catch (error: unknown) {
    console.error("Error marking messages as read:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== GET ALL MESSAGES (PAGINATED) ========================
export const allMessages = async (
  req: Request<{ id: string }, {}, {}, PaginationQuery>,
  res: Response
): Promise<Response> => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page ?? 1);

    const skipMessages = (page - 1) * pageSize;

    const messages = await Message.find({
      chat: new Types.ObjectId(req.params.id),
    })
      .populate("sender", "username profile email")
      .populate("chat")
      .sort({ createdAt: -1 })
      .skip(skipMessages)
      .limit(pageSize);

    const populatedMessages = await User.populate(messages, {
      path: "chat.users",
      select: "username profile email",
    });

    return successResponse(res, populatedMessages, "Messages retrieved successfully", 200);
    
  } catch (error: unknown) {
    console.error("Error fetching paginated messages:", error);
    return errorResponse(res, "Internal server error: Could not retrieve messages", 500);
  }
};


