import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { Types } from "mongoose";
import { MessagePayload } from "../types";

// ======================== SOCKET SETUP ========================
function setupSocket(server: HttpServer): void {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  // 🔥 USER SETUP
  socket.on("setup", (userId: string) => {
    socket.join(userId);
    socket.emit("connected");
    console.log("User setup:", userId);
  });

  // JOIN CHAT ROOM
  socket.on("join chat", (roomId: string) => {
    if (!Types.ObjectId.isValid(roomId)) return;

    socket.join(roomId);
    console.log(`User joined chat room: ${roomId}`);
  });

  // NEW MESSAGE
  socket.on("new message", (messageData: MessagePayload) => {
    const chat = messageData.chat;
    if (!chat?.users?.length) return;

    chat.users.forEach((user) => {
      if (user._id === messageData.sender._id) return;

      socket.to(user._id).emit("message received", messageData);
    });
  });

  // TYPING
  socket.on("typing", (roomId: string) => {
    socket.to(roomId).emit("typing");
  });

  socket.on("stop typing", (roomId: string) => {
    socket.to(roomId).emit("stop typing");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
}

export default setupSocket;