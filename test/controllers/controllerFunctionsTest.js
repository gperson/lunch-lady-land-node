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
});
