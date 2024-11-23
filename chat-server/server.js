const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust according to your client URL
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
    console.log(`User  connected: ${socket.id}`);

    // Notify when a user joins
    socket.on("user joined", (username) => {
        socket.broadcast.emit("chat message", `${username} has joined the chat`);
    });

    // Handle chat messages
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        console.log(`User  disconnected: ${socket.id}`);
    });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public"))); // Corrected path

// Serve index.html on root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html")); // Corrected path
});

server.listen(9000, () => console.log("Server is running on port 9000"));