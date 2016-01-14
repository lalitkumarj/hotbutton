var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  res.sendfile('./index.html');
});

io.on('connection', function(socket){
    console.log('a user connected',socket.id);
    socket.on('chat message', function(msg){
	console.log('message: ' + msg);
	io.emit('mmm',msg+'!');
    });
    socket.on('login', function(id){
	console.log('id: ' + id);
	io.emit('welcome','whello');
    });
});

http.listen(3797, function(){
  console.log('listening on *:3797');
});

