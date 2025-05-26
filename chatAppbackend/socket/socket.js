import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://talk-17wq.onrender.com",
        methods: ['GET', 'POST'],
        credentials: true
    }
});

export const getRecipientsSocketId = (recipientId) => {
    return userSocketMap[recipientId];
};

const userSocketMap = {}; //userId : socketId

io.on('connection', (socket) => {
    console.log('User connected', socket.id);
    const userId = socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        // Emit online users to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
        try {
            await Message.updateMany(
                { conversationId: conversationId, seen: false },
                { $set: { seen: true } }
            );
            await Conversation.updateOne(
                { _id: conversationId },
                { $set: { "lastMessage.seen": true } }
            );
            io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("disconnect", () => {
        console.log('User disconnected', socket.id);
        if (userId) {
            delete userSocketMap[userId];
            // Emit updated online users list after disconnection
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

export { io, server, app };