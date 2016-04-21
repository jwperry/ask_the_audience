const socket = io();

var connectionCount = document.getElementById('connection-count');
var statusMessage = document.getElementById('status-message');
var buttons = document.querySelectorAll('#choices button');
var voteConfirm = document.getElementById('vote-confirm');
var votes = document.getElementById('all-votes');
var aVotes = document.getElementById('a-votes');
var bVotes = document.getElementById('b-votes');
var cVotes = document.getElementById('c-votes');
var dVotes = document.getElementById('d-votes');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast', this.innerText);
  });
}

socket.on('usersConnected', function(count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', function(message) {
  statusMessage.innerText = message;
});

socket.on('voteCount', function(votes) {
  aVotes.innerText = votes["A"];
  bVotes.innerText = votes["B"];
  cVotes.innerText = votes["C"];
  dVotes.innerText = votes["D"];
});

socket.on('voteConfirm', function(confirm) {
  voteConfirm.innerText = confirm;
});
