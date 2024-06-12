require("dotenv").config();
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import "dotenv/config";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import dbconnection from "./config/db";
import cors from "cors";
const app = express();

const httpServer = createServer(app);
const onlineUsers = new Map<string, string>();
let onlineUsersArr: Array<string> = [];

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://peer-chat-2-bf4t.vercel.app"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://peer-chat-2-bf4t.vercel.app"],
  })
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

io.on("connection", (socket) => {
  socket.on("addUser", (id: string) => {
    onlineUsers.set(id, socket.id);
    if (onlineUsersArr.includes(id) === false) onlineUsersArr.push(id);
    io.emit("onlineUsers", onlineUsersArr);
  });
  socket.on("logout", (id: string) => {
    onlineUsersArr.splice(onlineUsersArr.indexOf(id), 1);
    io.emit("onlineUsers", onlineUsersArr);
  });
  socket.on("requestConnection", (toId, fromId, popupLabel) => {
    const socketid = onlineUsers.get(toId);
    if (socketid) io.to(socketid).emit("showPopup", { fromId, popupLabel });
  });

  socket.on("typing", (to, from) => {
    const socketid = onlineUsers.get(to);
    if (socketid) io.to(socketid).emit("showTyping");
  });
  socket.on("browserRefresh", (to) => {
    const socketid = onlineUsers.get(to);
    if (socketid) io.to(socketid).emit("browserRefresh");
  });
  socket.on("reqCancelled", (to) => {
    const socketid = onlineUsers.get(to);
    if (socketid) io.to(socketid).emit("reqCancelled");
  });

  socket.on("reqAnswer", (rid, from, to, isAccepted, popupLabel) => {
    if (isAccepted === true) {
      const socketid = onlineUsers.get(to);
      if (socketid) io.to(socketid).emit("reqAccepted", rid, from, popupLabel);
    } else {
      const socketid = onlineUsers.get(to);
      if (socketid) io.to(socketid).emit("reqDeclined", null, from, popupLabel);
    }
  });
});

const url = process.env.URI as string;

dbconnection(url)
  .then(() => {
    httpServer.listen(3000, () => console.log("Server is running fine"));
  })
  .catch((err) => console.log("Error in connection to the database", err));
