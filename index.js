import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

// Initialize Express app
const app = express();
app.use(cors());

// Create an HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_IO_URL,
    methods: ["GET", "POST"],
  },
});

// Socket.io event handlers
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

// Define a basic route for testing
app.get("/", (req, res) => {
  res.json("Server is working fine!");
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on ports ${PORT}`);
});
