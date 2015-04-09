var url = require('url');

var controllers = {}


module.exports.addController = function (name, controller){
	controllers[name] = controller;
}

module.exports.handleRequest = function (request, response, connection){
	if(url.parse(request.url).path.split("/").length > 2){
		var controller = url.parse(request.url).path.split("/")[2].split("?")[0];
		console.log("Processing controller request for object : " + controller);
		var endpoint = controllers[controller];
		if (endpoint != undefined){
			response.setHeader('Access-Control-Allow-Origin','*');
			endpoint.handleRequest(request, response, connection);
		} else {
			response.writeHead(404);
			response.end();
		}
	} else {
		//TODO favicon.ico
		//Server fails when Chrome tries to fetch the Favicon
		response.end();
	}	
}
