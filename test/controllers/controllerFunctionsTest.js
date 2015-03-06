var unit = require("unit.js");

describe("ControllerFunctions", function(){
	describe("isDefined", function(){
		it("Should return true if the field is defined", function(done){
			var testee = require("../../src/controllers/controllerFunctions");
			var field_object;
			var output;
			
			unit.given("an object that has been defined", function(){
				field_object = "bob 123";
			}).when("the method is called", function(){
				output = testee.isDefined(field_object);
			}).then("the output should be true", function(){
				output.should.be.true;
			});
			done();
		});

		it("Should return false if the field is not defined", function(done){
			var testee = require("../../src/controllers/controllerFunctions");
			var field_object;
			var output;
			
			unit.given("an object that has not been defined").when("the method is called", function(){
				output = testee.isDefined(field_object);
			}).then("the output should be false", function(){
				output.should.be.false;
			});
			done();
		});
		
		it("Should return true if the field is null", function(done){
			var testee = require("../../src/controllers/controllerFunctions");
			var field_object;
			var output;
			
			unit.given("an object that has been defined as null", function(){
				field_object = null;
			}).when("the method is called", function(){
				output = testee.isDefined(field_object);
			}).then("the output should be true", function(){
				output.should.be.true;
			});
			done();
		});

	
	});
	
	describe("sendResponse", function(){
		it("Should handle having a success status and non null return object", function(done){
			var testee = require("../../src/controllers/controllerFunctions");
			var json;
			var isSuccess;
			var response = {writeHead:unit.spy(), write:unit.spy(), end:unit.spy()};

			unit.given("a true success flag and a response object",function(){
				isSuccess = true;
				json = "this is a json response";
			}).when("the method is called",function(){
				testee.sendResponse(response, isSuccess, json);
			}).then("writeHead, write and end should be called on the response object", function(){
				(response.writeHead.calledWith(200, {'Content-Type': 'application/json'})).should.be.true;
				(response.write.calledWith("this is a json response")).should.be.true;
				(response.end.calledOnce).should.be.true;
			});
			done();
		});
		
		it("Should handle having a success status and null return object", function(done){
			var testee = require("../../src/controllers/controllerFunctions");
			var json;
			var isSuccess;
			var response = {writeHead:unit.spy(), write:unit.spy(), end:unit.spy()};

			unit.given("a true success flag and a null response object",function(){
				isSuccess = true;
				json = null;
			}).when("the method is called",function(){
				testee.sendResponse(response, isSuccess, json);
			}).then("writeHead, end should be called on the response object", function(){
				(response.writeHead.calledWith(200)).should.be.true;
				(response.write.notCalled).should.be.true;
				(response.end.calledOnce).should.be.true;
			});
			done();
		});
		
		it("Should handle having a non success status and non null return object", function(done){
			var testee = require("../../src/controllers/controllerFunctions");
			var json;
			var isSuccess;
			var response = {writeHead:unit.spy(), write:unit.spy(), end:unit.spy()};

			unit.given("a false success flag and a response object",function(){
				isSuccess = false;
				json = "this is a json response";
			}).when("the method is called",function(){
				testee.sendResponse(response, isSuccess, json);
			}).then("writeHead, write and end should be called on the response object", function(){
				(response.writeHead.calledWith(400, {'Content-Type': 'application/json'})).should.be.true;
				(response.write.calledWith("this is a json response")).should.be.true;
				(response.end.calledOnce).should.be.true;
			});
			done();
		});
		
		it("Should handle having a non success status and null return object", function(done){
			var testee = require("../../src/controllers/controllerFunctions");
			var json;
			var isSuccess;
			var response = {writeHead:unit.spy(), write:unit.spy(), end:unit.spy()};

			unit.given("a false success flag and no response object",function(){
				isSuccess = false;
				json = null;
			}).when("the method is called",function(){
				testee.sendResponse(response, isSuccess, json);
			}).then("writeHead, write and end should be called on the response object", function(){
				(response.writeHead.calledWith(400)).should.be.true;
				(response.write.calledWith('{ "error" : "Could not complete the request successfully." }')).should.be.true;
				(response.end.calledOnce).should.be.true;
			});
			done();
		});
		
		
	});
	
	describe("buildErrorJSON", function(){
		it("Should place a message in a json error wrapper", function(done){
		var testee = require("../../src/controllers/controllerFunctions");
		var message;
		var output;
		unit.given("a message to send", function(){
			message = "dancing hot dogs";
		}).when("the method is called", function(){
			output = testee.buildErrorJSON(message);
		}).then("the output should contain the message", function(){
			output.should.be.equal('{ "error" : "dancing hot dogs" }');
		});
		done();
	});
});
});
