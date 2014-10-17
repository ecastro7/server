/**
 * Codigo del Cliente
 */

$(function() {
	var socket = io('http://node.com'),
		$user = $('#username');
	
	socket.on('news', function(data) {
		console.log('Connected with socket');
		console.info(data);
	});
})