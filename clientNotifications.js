/**
 * Codigo del Cliente
 */

var socket = io.connect('http://node.com');

//al actualizar la página eliminamos la sesión del usuario de sessionStorage
$(document).ready(function()
{
    manageSessions.unset("login");
});


//función para mantener el scroll siempre al final del div donde se muestran los mensajes
//con una pequeña animación
function animateScroll()
{
    var container = $('#contenido');
    container.animate({"scrollTop": $('#contenido')[0].scrollHeight}, "slow");
}


//función anónima donde vamos añadiendo toda la funcionalidad del chat
$(function()
{
    //al pulsar en el botón de Connect 
    $("#connectBtn").on("click", function(e)
    {
        e.preventDefault();
        //en otro caso, creamos la sesión login y lanzamos el evento loginUser
        //pasando el nombre del usuario que se ha conectado
        manageSessions.set("login", $("#username").val());
        console.info("Username: " + manageSessions.get("login"));
        //llamamos al evento loginUser, el cuál creará un nuevo socket asociado a nuestro usuario
        socket.emit("loginUser", manageSessions.get("login"));
    });

    //cuando se emite el evente refreshChat
    socket.on("refreshChat", function(action, message)
    {
        //simplemente mostramos el nuevo mensaje a los usuarios
        //si es una nueva conexión
        if(action == "conectado")
        {
            $("#contenido").append("<p class='col-lg-12 alert-info'>" + message + "</p>");
        }
        //si es una desconexión
        else if(action == "desconectado")
        {
            $("#contenido").append("<p class='col-lg-12 alert-danger'>" + message + "</p>");
        }
        //si es un nuevo mensaje 
        else if(action == "msg")
        {
            $("#contenido").append("<p class='col-lg-12 alert-warning'>" + message + "</p>");
        }
        //si el que ha conectado soy yo
        else if(action == "yo")
        {
            $("#contenido").append("<p class='col-lg-12 alert-success'>" + message + "</p>");
        }
        //llamamos a la función que mantiene el scroll al fondo
        animateScroll();
    });

    //al pulsar en el botón de Private 
    $("#privateBtn").on("click", function(e)
    {
        e.preventDefault();
        alert($("#destino").val());
        console.info("Destino: " + $("#destino").val());
        //llamamos al evento loginUser, el cuál creará un nuevo socket asociado a nuestro usuario
        socket.emit("PrivateMsg", $("#username").val(), $("#destino").val(), "hola "+$("#destino").val());
    });

    //cuando un usuario envia un nuevo mensaje, el parámetro es el 
	//mensaje que ha escrito en la caja de texto
	socket.on('private', function(username, data) {
		alert("hoal");
		console.log(username);
		console.log(data);
	});



});

//objeto para el manejo de sesiones
var manageSessions = {
    //obtenemos una sesión //getter
    get: function(key) {
        return sessionStorage.getItem(key);
    },
    //creamos una sesión //setter
    set: function(key, val) {
        return sessionStorage.setItem(key, val);
    },
    //limpiamos una sesión
    unset: function(key) {
        return sessionStorage.removeItem(key);
    }
};

//función que comprueba si un objeto está vacio, devuelve un boolean
function isEmptyObject(obj) 
{
    var name;
    for (name in obj) 
    {
        return false;
    }
    return true;
}