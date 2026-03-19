import { Schema, model, models} from "mongoose";

/* ======================== MESSAGE SCHEMA ======================== */
const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      trim: true,
      required: true,
    },

    receiver: {
      type: String,
      trim: true,
    },

    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

/* ======================== MODEL ======================== */
const Message = models.Message || model("Message", MessageSchema);
export default Message;
