const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const chattyMcChatSpace = io.of('/chat')

const path = require('path');

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// io.on('connection', function(socket){
//   console.log('a user connected');
// });

// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     console.log('message: ' + msg);
//   });
// });


io.on('connection', socket => {

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  io.clients((error, clients) => {
    if (error) throw error;
    // console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
    io.sockets.emit('users online', { usersArr: clients })
  });

  let qty = io.engine.clientsCount;

  io.sockets.emit('new connection', {qty: qty });

  socket.on('disconnect', reason => {
    qty = io.engine.clientsCount;
    socket.broadcast.emit('lost connection', {qty: qty })
  })


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
