const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { Server } = require('socket.io');
const http = require('http');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://papayachat-f48cd-default-rtdb.europe-west1.firebasedatabase.app/"
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send-message', async (data) => {
    try {
      // Save to Firebase
      const messageRef = admin.database().ref('messages').push();
      await messageRef.set({
        text: data.text,
        userId: data.userId,
        roomId: data.roomId,
        timestamp: admin.database.ServerValue.TIMESTAMP
      });

      // Broadcast to room
      io.to(data.roomId).emit('new-message', data);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});