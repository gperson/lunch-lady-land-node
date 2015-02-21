var http = require('http');
var lll = require('./LunchLadyLand')
var mysql = require('mysql');

//pull the host name from command line if passed. 
var hostin = process.argv[2];
if(hostin == null){
	hostin = 'localhost'
}

/**
 * Database connection
 */
var connection = mysql.createConnection({
	host     : hostin,
	database : 'lunch_lady_land',
	user     : 'root',
	password : 'root',
});

lll.addController("user", require('./controllers/user'));
lll.addController("office", require('./controllers/office'));
lll.addController("order", require('./controllers/order'));
lll.addController("restaurant", require('./controllers/restaurant'));


var server = http.createServer(function (request,response){	
	lll.handleRequest(request, response, connection);
});

server.listen(4968);
console.log("Server Started on port 4968");
