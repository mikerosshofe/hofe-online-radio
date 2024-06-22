const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  // Handle peer-to-peer video communication
  socket.on('signal', (data) => {
    io.to(data.target).emit('signal', {
      signal: data.signal,
      callerId: data.callerId
    });
  });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit('user-connected', socket.id);

    socket.on('disconnect', () => {
      io.to(roomId).emit('user-disconnected', socket.id);
    });
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Listening on *:3000');
});
