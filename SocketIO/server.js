import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);
// const url = 'http://192.168.1.33:3001/';
const url='http://localhost:3001'

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

  const allUsers = async (req, res) => {
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
    io.emit("getAllUsers", filteredUsers);
  };

  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
  }
  await allUsers();

  const interval = setInterval(() => {
    socket.emit("ping");  // Send a ping message to the client
  }, 10000);  // Send ping every 10 seconds

  // Listen for pong from the client
  socket.on("pong", () => {
    console.log("Pong received from client:", socket.id);
  });
  

  socket.on("newMessage", (msg) => {
    console.log(`📩 Received message: ${msg}`);
    socket.emit("response", `📨 Server says: ${msg}`);
  });

  socket.on("disconnect", async() => {
    clearInterval(interval);
    await allUsers()
  });


  
});

export { app, io, server };
