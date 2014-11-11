module.exports.handleRequest = function(request, response){
	response.writeHead(200, {'Content-Type':'application/json'});
	response.write('{"test":"test"}');
	response.end();
}
