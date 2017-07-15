const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = require('path');

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

let usersObj = {};

io.on('connection', socket => {
  let qty = io.engine.clientsCount;

  io.sockets.emit('new connection', {qty: qty });

  socket.on('disconnect', reason => {
    delete usersObj[socket.id];
    socket.broadcast.emit('lost connection', {qty: qty });
  })

  socket.on('chat message', (msg, nickName, id) => {
    io.emit('chat message', msg, nickName);

    let usersObjKeys = Object.keys(usersObj);
    if (!usersObjKeys.includes(id)) {
      usersObj[id] = nickName;
    } else {
      usersObjKeys.forEach( socketId => {
        if (id === socketId) {
          usersObj[socketId] = nickName;
        }
      })
    }
  });

  io.clients((error, clients) => {
    let nameList = clients.map( id => {
      return usersObj[id] ? usersObj[id] : id;
    })

    if (error) throw error;
    io.sockets.emit('users online', { usersArr: nameList })
  });

  socket.on('user typing', id => {
    socket.broadcast.emit('user typing', usersObj[id] || id)
  })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
