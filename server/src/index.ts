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
const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
  socket.on("wave", (content: string) => {
    console.log(content);
    console.log("Event is received over server side");
  });
  socket.on("addUser", (id: string) => {
    onlineUsers.set(id, socket.id);
    console.log("User added:", id);
  });

  socket.on("requestConnection", (toId, fromId, popupLabel) => {
    const socketid = onlineUsers.get(toId);
    if (socketid) io.to(socketid).emit("showPopup", { fromId, popupLabel });
  });

  socket.on("reqAnswer", (rid, from, to, isAccepted) => {
    if (isAccepted === true) {
      const socketid = onlineUsers.get(to);
      if (socketid) io.to(socketid).emit("reqAccepted", rid);
    } else {
      const socketid = onlineUsers.get(to);
      if (socketid) io.to(socketid).emit("reqDeclined", null);
    }
  });
});

const url = process.env.URI as string;

console.log(url);
dbconnection(url)
  .then(() => {
    httpServer.listen(3000, () => console.log("Server is running fine"));
  })
  .catch((err) => console.log("Error in connection to the database", err));
