import { Server } from "socket.io";
import http from "http";
import express from "express";
// import User from "../models/user.model";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);
const url = 'http://192.168.1.51:3001/';

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// realtime message code goes here
export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};
const users = {};

io.on("connection", async(socket) => {
  console.log("🔗 A user connected:",socket.id);


  const allUsers = async (req, res) => {
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
    io.emit("getAllUsers", filteredUsers);
  };

  // ✅ Get user ID from handshake query
  const userId = socket.handshake.query.userId;
  console.log("User ID:", userId);
  if (userId) {
    users[userId] = socket.id;
    console.log("Users:", users);
  }
  await allUsers();

  const interval = setInterval(() => {
    socket.emit("ping");  // Send a ping message to the client
  }, 10000);  // Send ping every 10 seconds

  // Listen for pong from the client
  socket.on("pong", () => {
    console.log("Pong received from client:", socket.id);
  });
  

  // ✅ Listen for reconnection attempts
  socket.on("reconnect_attempt", (attempt) => {
    console.log(`♻️ User ${userId} is attempting to reconnect (Attempt #${attempt})`);
  });

  // ✅ Listen for successful reconnections
  socket.on("reconnect", () => {
    console.log(`✅ User ${userId} successfully reconnected.`);
  });

  // ✅ Listen for failed reconnections
  socket.on("reconnect_failed", () => {
    console.log(`⚠️ User ${userId} failed to reconnect.`);
  });

  socket.on("newMessage", (msg) => {
    console.log(`📩 Received message: ${msg}`);
    socket.emit("response", `📨 Server says: ${msg}`);
  });

  // ✅ Update online users
  io.emit("getOnlineUsers", Object.keys(users));

  // io.emit("getAllUsers", Object.keys(users));

  // ✅ Handle disconnection
  socket.on("disconnect", async() => {
    clearInterval(interval);
    console.log("❌ User disconnected:", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
    await allUsers()
  });


  
});

export { app, io, server };
