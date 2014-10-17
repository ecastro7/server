/**
 * Codigo de Servidor
 */

var app = require('http').createServer(handler);
var io = require('socket.io')(app);

var PORT = process.env.PORT || 4000;

app.listen(PORT, function() {
	console.log("Listening on port " + PORT);
});

function handler(req, res) {
	
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});