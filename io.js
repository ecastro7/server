module.exports = function(io) {

	//objecto para guardar en la sesión del socket a los que se vayan conectando
	var username = {};
	var usersocket = {};

	//al conectar un usuario||socket, este evento viene predefinido por socketio
	io.sockets.on('connection', function(socket) {

		console.log("User Conectado ");
		console.log(socket.client.conn.server.clientsCount);

		//cuando el usuario conecta al chat comprobamos si está logueado
		//el parámetro es la sesión login almacenada con sessionStorage
		socket.on("loginUser", function(name)
		{
			//Guardamos el nombre de usuario en la sesión del socket para este cliente
			socket.username = name;
			//añadimos al usuario a la lista global donde almacenamos usuarios
			username[socket.username] = socket.username;
			usersocket[socket.username] =socket.id;
			console.log(username);
			console.info(socket.username);
			console.info("numero de conectados: " + socket.client.conn.server.clientsCount);
			//mostramos al cliente como que se ha conectado
			socket.emit("refreshChat", "yo", "Bienvenido " + socket.username + ", te has conectado correctamente.");
			//mostramos de forma global a todos los usuarios que un usuario
			//se acaba de conectar al chat
			socket.broadcast.emit("refreshChat", "conectado", "El usuario " + socket.username + " se ha conectado al chat.");
			
		});

		//cuando el usuario conecta al chat comprobamos si está logueado
		//el parámetro es la sesión login almacenada con sessionStorage
		socket.on('PrivateMsg', function (usr, from, msg) {
		    console.log('I received a private message by ', from, ' saying ', msg);
		    console.log(socket.id);
   			console.log("From user: "+from);
			console.log("To user: "+usr);
			console.log(username);
			console.log(usersocket);
			console.info(socket.client.conn.server);
			console.log(usersocket[from]);
			io.to(usersocket[from]).emit('private', from, msg);
			console.info("enviado");
	  	});

		//cuando un usuario envia un nuevo mensaje, el parámetro es el 
		//mensaje que ha escrito en la caja de texto
		socket.on('addNewMessage', function(message) 
		{
			//pasamos un parámetro, que es el mensaje que ha escrito en el chat, 
			//ésto lo hacemos cuando el usuario pulsa el botón de enviar un nuevo mensaje al chat

			//con socket.emit, el mensaje es para mi
			socket.emit("refreshChat", "msg", "Yo : " + message + ".");
			//con socket.broadcast.emit, es para el resto de usuarios
			socket.broadcast.emit("refreshChat", "msg", socket.username + " dice: " + message + ".");
		});

		//cuando el usuario cierra o actualiza el navegador
		socket.on("disconnect", function()
		{
			//si el usuario, por ejemplo, sin estar logueado refresca la
			//página, el typeof del socket username es undefined, y el mensaje sería 
			//El usuario undefined se ha desconectado del chat, con ésto lo evitamos
			if(typeof(socket.username) == "undefined")
			{
				return;
			}
			//en otro caso, eliminamos al usuario
			delete username[socket.username];
			//actualizamos la lista de usuarios en el chat, zona cliente
			io.sockets.emit("updateSidebarUsers", username);
			//emitimos el mensaje global a todos los que están conectados con broadcasts
			socket.broadcast.emit("refreshChat", "desconectado", "El usuario " + socket.username + " se ha desconectado del chat.");
		});
	});
}