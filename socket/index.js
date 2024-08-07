const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: true,
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New connection: " + socket.id);

  socket.on("addNewUser", (userId) => {
    if(!onlineUsers.some(user => user.userId === userId)) { //check if user is already online
      onlineUsers.push({
        userId,
        socketId: socket.id,
      }); 
    }
    console.log("onlineUsers", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(user => user.userId === message.recipientId);

    if(user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });

    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  })
});

io.listen(5000);