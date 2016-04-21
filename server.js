const http = require('http');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);

var votes = {};

server.listen(port, function() {
  console.log('Listening on port ' + port + '.');
});

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
  console.log('A user has connected.' + ' Users: ' + io.engine.clientsCount);
  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('disconnect', function() {
    console.log('A user has disconnected.' + ' Users: ' + io.engine.clientsCount);
    delete votes[socket.id];
    socket.emit('voteCount', countVotes(votes));
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });

  socket.on('message', function(channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      var confirmMessage = 'You have cast your vote for: ' + message + '.';
      socket.emit('voteCount', countVotes(votes));
      socket.emit('voteConfirm', confirmMessage);
    }
  });
});

function countVotes(votes) {
  var voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };

  for (var vote in votes) {
    voteCount[votes[vote]]++
  }

  return voteCount;
}

module.exports = server;
