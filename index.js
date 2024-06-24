const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Require path module for file paths

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io logic
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  socket.on('signal', (data) => {
    socket.broadcast.emit('signal', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
