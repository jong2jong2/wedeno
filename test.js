var io = require('socket.io-client');
var socket = io.connect('http://localhost:45588');

socket.on('dataset', function(data){
   console.log('s');
});
socket.on('connect', function() {
    console.log('Connected!');
});
socket.on('event', function(socket) {
    console.log('event!');
});

io.on('connection', function(){

});
