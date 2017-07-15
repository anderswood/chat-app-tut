var socket = io();

let nickName = $('#nickname');
let message = $('#m');

// Send message over the websocket when form is submitted
$('#msg-input').submit( () => {
  socket.emit('chat message', message.val(), nickName.val(), socket.id);
  message.val('');
  return false;
});

message.keyup( () => {
  if (message.val()) {
    socket.emit('user typing', socket.id)
  }
})

// Receive message from websocket
socket.on('chat message', (msg, nickname) => {
  $('#messages').append($('<li>').text(`${nickname}: ${msg}`));
});

socket.on('new connection', msg => {
  $('#messages').append($('<li>').text(`** ${msg.qty} chat peeps are up in here **`))
})

socket.on('lost connection', msg => {
  $('#messages').append($('<li>').text(`** ${msg.qty} chat peeps are up in here **`))
})

socket.on('users online', clients => {
  if (clients.usersArr) {
    let userStr = '';
    clients.usersArr.forEach( user => {
      userStr = userStr + user + ', ';
    })
    $('#messages').append($('<li>').text(`* ${userStr} is/are online **`))
  }

  socket.on('user typing', userName => {
    $('#messages').append($('<li>').text(`* ${userName} is typing... **`))

  })

})
