import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
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

io.on("connection", (socket) => {
  socket.on("wave", (content: string) => {
    console.log(content);
    console.log("Event is received over server side");
  });
});

httpServer.listen(3000, () => console.log("Server is running at 3000"));
