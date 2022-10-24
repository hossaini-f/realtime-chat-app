import express  from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';

import { addUser, removeUser, getUser, getUsersInRoom } from './users.js';
import router from './router.js';

const app = express();
app.use(express.urlencoded({limit: '30mb', extended: true}));
app.use(router);
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
}));

const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

// Start of Application
io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });
  
      if(error) return callback(error);
  
      socket.join(user.room);
  
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
  
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
  
      callback();
    });
  
    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);
  
      io.to(user.room).emit('message', { user: user.name, text: message });
  
      callback();
    });
  
    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
  
      if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      }
    })
  });  
// End

server.listen(PORT, () => console.log(`Server is listening on ${PORT}.`));