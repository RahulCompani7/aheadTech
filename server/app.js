const express = require('express');
const http = require('http');
const Server = require('socket.io').Server;
const Connection = require('./db.js');
const mongoose = require("mongoose");
const Chat = require('./models/Chat.js');
const { timeStamp } = require('console');

const app = express();
app.use(express.json());
Connection();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Define the online users object to track connected users and their last active time
let onlineUsers = {};

// When a user connects
io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    // Event when a user connects
    socket.on("userConnected", (username) => {
        // Store the username, socket ID, and last active time in onlineUsers
        onlineUsers[username] = { socketId: socket.id, lastActive: new Date() };
        console.log(`${username} connected with socket id: ${socket.id}`);
        
        // Send updated online users list to all clients
        io.emit("onlineUsers", Object.keys(onlineUsers));

        // Notify other users that the user is online
        socket.broadcast.emit("userStatus", { username, status: 'online' });
    });

    // Event when a user sends a message
    socket.on('newMessage', async (msg) => {
        try {
            const newMessage = new Chat(msg);
            await newMessage.save();
            io.emit('message', msg);

            // Update last active time for the sender
            if (onlineUsers[msg.username]) {
                onlineUsers[msg.username].lastActive = new Date();
            }
        } catch (err) {
            console.log(err);
        }
    });

    // Event when a user disconnects
    socket.on("disconnect", () => {
        for (let username in onlineUsers) {
            if (onlineUsers[username].socketId === socket.id) {
                // Set the last active time and notify others of the user's status
                onlineUsers[username].lastActive = new Date();
                console.log(`${username} disconnected, last active: ${onlineUsers[username].lastActive}`);

                // Notify other users that the user is offline
                socket.broadcast.emit("userStatus", { username, status: 'offline' });

                onlineUsers[username].socketId = null;

                break;
            }
        }
        console.log("User disconnected: " + socket.id);
        
        // Send updated online users list to all clients
        io.emit("onlineUsers", Object.keys(onlineUsers));
    });

    // Typing indicator
socket.on("typing", (fromUser) => {
    socket.broadcast.emit("typing", fromUser);
});

socket.on("stopTyping", (fromUser) => {
    socket.broadcast.emit("stopTyping", fromUser);
});

    // Get last seen or offline status for a user
    socket.on("getLastSeen", (username) => {
  const user = onlineUsers[username];
  if (user && user.socketId) {
    socket.emit("lastSeen", { username, status: "online" });
  } else if (user && user.lastActive) {
    socket.emit("lastSeen", { username, status: "offline", lastActive: user.lastActive });
  } else {
    socket.emit("lastSeen", { username, status: "offline", lastActive: null });
  }
});


    const loadMessages = async () => {
        try {
            const messages = await Chat.find().sort({ timeStamp: 1 }).exec();
            socket.emit('chat', messages);
        } catch (err) {
            console.log(err);
        }
    };

    loadMessages();
});

server.listen("3002", () => {
    console.log("Server running on port 3002");
});
