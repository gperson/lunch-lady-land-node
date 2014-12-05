var http = require('http');
var url = require('url');

var controllers = {
	user : require('./controllers/user'),
	office: require('./controllers/office'),
	order: require('./controllers/order'),
	restaurant : require('./controllers/restaurant')
}	

var server = http.createServer(function (request,response){
	if(url.parse(request.url).path.split("/").length > 1){
		var controller = url.parse(request.url).path.split("/")[2].split("?")[0];
		console.log("Processing controller request for object : " + controller);
		var endpoint = controllers[controller];
		if (endpoint != undefined){
			endpoint.handleRequest(request, response);
		} else {
			response.writeHead(404);
			response.end();
		}
	} else {
		//TODO favicon.ico
		//Sever fails when Chrome tries to fetch the Favicon
		response.end();
	}
});

server.listen(4968);
console.log("Server Started on port 4968");