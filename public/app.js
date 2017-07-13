var socket = io();

$('form').submit(() => {
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('chat message', (msg) => {
  $('#messages').append($('<li>').text(msg));
});

socket.on('new connection', msg => {
  $('#messages').append($('<li>').text(`** ${msg.qty} chat peeps are up in here **`))
})

socket.on('lost connection', msg => {
  $('#messages').append($('<li>').text(`** ${msg.qty} chat peeps are up in here **`))
})

socket.on('users online', msg => {
  console.log(msg.usersArr);

  if (msg.usersArr) {
    let userStr = '';
    msg.usersArr.forEach( user => {
      userStr = userStr + user + ', ';
    })
    $('#messages').append($('<li>').text(`* ${userStr} is/are online **`))
  }

})
