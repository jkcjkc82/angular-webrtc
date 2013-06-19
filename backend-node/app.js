var io = require('socket.io').listen(3000);
var users = [];

io.sockets.on('connection', function (socket) {
	socket.on('regUsername', function(data) {
		socket.join('room1');

		data.id = socket.id;
		users.push(data);

		socket.emit('regUsernameCallback',socket.id);
	});

	socket.on('postMessage', function(data) {
		data.id = socket.id;
		socket.broadcast.in("room1").emit('receiveMessage', data);
		socket.emit('receiveMessage', data);
	});

	// room2에 들어가기
	socket.on('join', function() {
		socket.join('room2');
	});

	// SDP 요청
	socket.on('req', function(description) {
		// 클라이언트에 데이터 전달
		socket.broadcast.in("room2").emit('res', description);
	});		

	socket.on('disconnect', function() {
		socket.leave("room1");
	});
});