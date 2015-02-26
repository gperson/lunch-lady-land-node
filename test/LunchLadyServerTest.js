var unit = require("unit.js");

describe("LunchLadyLand" , function (){
	describe("handleRequest", function(){
		it("Should Handle a a request if a controller is found and the path is correct", function(done){
			var testee = require("../src/LunchLadyLand");
			var request = new Object();
			var response = new Object(); 
			var connection = new Object(); 
			var controller = { handleRequest: function(){}};
			
			
			
			unit.given("All inputs are valid and controller(s) are set", function (){
				request.url = "http://www.test.com:1234/v1/test";
				unit.spy(controller, "handleRequest");
				testee.addController("test", controller);
				
			}).when("handle Request Is Called", function(){
				testee.handleRequest(request, response, connection);
				}).then("controller.handleRequest should be called with correct inputs", function (){
					(controller.handleRequest.calledWith(request, response, connection)).should.be.true;
					
				});
			done();
		});
		
		it("Should return 404 status if the controller is not found", function(done){
			var testee = require("../src/LunchLadyLand");
			var request = new Object();
			var response = {writeHead:function(){}, end:function(){}}; 
			var connection = new Object(); 
			
			unit.given("input with unexpected route", function (){
				request.url = "http://www.test.com:1234/v1/someRandomThing";
				unit.spy(response, "writeHead");
				unit.spy(response, "end");
				
				}).when("handle Request Is Called", function(){
					testee.handleRequest(request, response, connection);
				}).then("response should have 404 and end be called", function (){
					(response.writeHead.calledWith(404)).should.be.true;
					(response.end.calledOnce).should.be.true;
				});
			done();
		});
		
		it("Should end the request if the url is not formatted correctly", function(done){
			var testee = require("../src/LunchLadyLand");
			var request = new Object();
			var response = {end:function(){}}; 
			var connection = new Object(); 
			
			unit.given("We have an unknown route", function (){
				request.url = "http://www.test.com:1234/someRandomThing";
				unit.spy(response, "end");
				
				}).when("handle Request Is Called", function(){
					testee.handleRequest(request, response, connection);
				}).then("response should have 404 and end be called", function (){
					(response.end.calledOnce).should.be.true;
				});
			done();
		});
	});
	
});
