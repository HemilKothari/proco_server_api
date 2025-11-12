const { Server } = require("socket.io");

function setupSocket(server) {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*", // or your Flutter app URL
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a specific chat room
    socket.on("join chat", (roomId) => {
      socket.join(roomId);
      console.log(`User joined chat room: ${roomId}`);
    });

    // Handle new messages
    socket.on("new message", (messageData) => {
      const chat = messageData.chat;
      if (!chat?.users) return;

      // Send message to all chat participants except sender
      chat.users.forEach((user) => {
        if (user._id === messageData.sender._id) return;
        socket.in(user._id).emit("message received", messageData);
      });
    });

    // Optional: typing indicator events
    socket.on("typing", (roomId) => socket.in(roomId).emit("typing"));
    socket.on("stop typing", (roomId) => socket.in(roomId).emit("stop typing"));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = setupSocket;
