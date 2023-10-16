import express from "express";
const app = express();
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

app.use(cors());

const server = http.createServer(app);

const isProduction = process.env.NODE_ENV === "production";
const socketIoOrigin = isProduction
  ? "https://your-vercel-app-url" // Replace with your Vercel app URL
  : "http://localhost:3000"; // Use your development URL

const io = new Server(server, {
  cors: {
    origin: socketIoOrigin,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use("/", (req, res) => {
  res.json("server working fine!");
});

server.listen(process.env.PORT || 3001, () => {
  console.log("SERVER RUNNING");
});
