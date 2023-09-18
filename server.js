const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const users = {}; 

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('register', (walletIdCookie) => {
    // Use the "walletId" cookie as the user's UUID if available
    const userUUID = walletIdCookie || uuidv4();
    users[userUUID] = socket;

    // Send the userUUID back to the client
    socket.emit('registered', userUUID);
  });

  socket.on('message', ({ recipientUUID, message }) => {
    const recipientSocket = users[recipientUUID];
    if (recipientSocket) {
      recipientSocket.emit('message', message);
    }
  });

  socket.on('disconnect', () => {
    const userUUID = Object.keys(users).find((key) => users[key] === socket);
    if (userUUID) {
      delete users[userUUID];
      console.log('A user disconnected');
    }
  });
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});
