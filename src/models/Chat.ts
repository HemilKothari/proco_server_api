import { Schema, model, models } from "mongoose";
import { ChatDocument } from "../types";

/* ======================== CHAT SCHEMA ======================== */
const ChatSchema = new Schema<ChatDocument>(
  {
    chatName: { type: String, trim: true, required: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat =
  models.Chat || model<ChatDocument>("Chat", ChatSchema);

export default Chat;
