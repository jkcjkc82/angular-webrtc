var io = require('socket.io').listen(3000);
var room_name = "room";

io.sockets.on('connection', function (socket) {
	socket.on('joinRoom', function() {
		socket.join(room_name);
		socket.emit('joinCallback');
	});
	
	socket.on('disconnect', function() {
		socket.leave(room_name);
	});	

	socket.on('sendSDP', function(description) {
		socket.broadcast.in(room_name).emit('receiveSDPCallback', description);
	});

	socket.on('returnSDP', function(description) {
		socket.broadcast.in(room_name).emit('receiveReturnSDPCallback', description);
	});	

	socket.on('sendCandidate', function(candidate) {
		socket.broadcast.in(room_name).emit('receiveCandidateallback', candidate);
	});
});