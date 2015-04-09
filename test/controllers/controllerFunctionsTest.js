var unit = require("unit.js");

describe("ControllerFunctions", function(){
	describe("isDefined", function(){
		var testee = require("../../src/controllers/controllerFunctions");
		it("Should return true if the field is defined", function(done){
			var field_object;
			var output;
			field_object = "bob 123";

			output = testee.isDefined(field_object);

			output.should.be.true;
			done();
		});

		it("Should return false if the field is not defined", function(done){
			var field_object;
			var output;

			output = testee.isDefined(field_object);

			output.should.be.false;
			done();
		});
		
		it("Should return true if the field is null", function(done){

			var field_object;
			var output;
			field_object = null;

			output = testee.isDefined(field_object);

			output.should.be.true;
			done();
		});

	
	});
	
	describe("sendResponse", function(){
		var testee = require("../../src/controllers/controllerFunctions");
		it("Should handle having a success status and non null return object", function(done){
			var json;
			var isSuccess;
			var response = {writeHead:unit.spy(), write:unit.spy(), end:unit.spy()};
			isSuccess = true;
			json = "this is a json response";

			testee.sendResponse(response, isSuccess, json);

			(response.writeHead.calledWith(200, {'Content-Type': 'application/json'})).should.be.true;
			(response.write.calledWith("this is a json response")).should.be.true;
			(response.end.calledOnce).should.be.true;
			done();
		});
		
		it("Should handle having a success status and null return object", function(done){
			var json;
			var isSuccess;
			var response = {writeHead:unit.spy(), write:unit.spy(), end:unit.spy()};
			isSuccess = true;
			json = null;

			testee.sendResponse(response, isSuccess, json);

			(response.writeHead.calledWith(200)).should.be.true;
			(response.write.notCalled).should.be.true;
			(response.end.calledOnce).should.be.true;
			done();
		});
		
		it("Should handle having a non success status and non null return object", function(done){
			var json;
			var isSuccess;
			var response = {writeHead:unit.spy(), write:unit.spy(), end:unit.spy()};
			isSuccess = false;
			json = "this is a json response";

			testee.sendResponse(response, isSuccess, json);

			(response.writeHead.calledWith(400, {'Content-Type': 'application/json'})).should.be.true;
			(response.write.calledWith("this is a json response")).should.be.true;
			(response.end.calledOnce).should.be.true;
			done();
		});
		
		it("Should handle having a non success status and null return object", function(done){
	
			var json;
			var isSuccess;
			var response = {writeHead:unit.spy(), write:unit.spy(), end:unit.spy()};
			isSuccess = false;
			json = null;

			testee.sendResponse(response, isSuccess, json);

			(response.writeHead.calledWith(400)).should.be.true;
			(response.write.calledWith('{ "error" : "Could not complete the request successfully." }')).should.be.true;
			(response.end.calledOnce).should.be.true;
			done();
		});
		
		
	});
	
	describe("buildErrorJSON", function(){
		var testee = require("../../src/controllers/controllerFunctions");

		it("Should place a message in a json error wrapper", function(done){
			var message;
			var output;
			message = "dancing hot dogs";

			output = testee.buildErrorJSON(message);

			output.should.be.equal('{ "error" : "dancing hot dogs" }');
			done();
	});
});

	describe("areValidParams", function(){
		var testee = require("../../src/controllers/controllerFunctions");
		
		beforeEach(function(){
			unit.stub(testee, "getValidParams");
			unit.stub(testee, "validateParam");
		});
		
		afterEach(function(){
			testee.getValidParams.restore();
			testee.validateParam.restore();
		});
		
		it("Should return true if all parameters are valid", function(done){
			
			var query;
			var validParamList;
			var output;
			query = "this is a query";
			validParamList = ["one", "two", "three"];
			var validParams = {one:"something", two:"somethingElse"}
			testee.getValidParams.withArgs(query, validParamList).returns(validParams);
			testee.validateParam.withArgs("one", "something", validParamList).returns(true);
			testee.validateParam.withArgs("two", "somethingElse", validParamList).returns(true);

			output = testee.areValidParams(query, validParamList);

			output.should.be.true;
	
			done();
		});
		
		it("Should return false if not all parameters are valid", function(done){
			var testee = require("../../src/controllers/controllerFunctions");
			var query;
			var validParamList;
			var output;
			query = "this is a query";
			validParamList = ["one", "two", "three"];
			var validParams = {one:"something", two:"somethingElse"}
			testee.getValidParams.withArgs(query, validParamList).returns(validParams);
			testee.validateParam.withArgs("one", "something", validParamList).returns(true);
			testee.validateParam.withArgs("two", "somethingElse", validParamList).returns(false);
				
			output = testee.areValidParams(query, validParamList);

			output.should.be.false;
			done();
		});
	});
	
	describe("validateParam", function (){
		var validParams = {"param1" : "email", "param2" : "url", "param3" :"alpha", "param4" :"numeric", "param5" : "alphanumeric", "param6" : "int", "param7" : "float", "param8" : "ascii"};
		var validator = require('validator');
		var testee = require("../../src/controllers/controllerFunctions");
					
		beforeEach(function(){
			unit.stub(validator, "isEmail");
			unit.stub(validator, "isURL");
			unit.stub(validator, "isAlpha");
			unit.stub(validator, "isNumeric");
			unit.stub(validator, "isAlphanumeric");
			unit.stub(validator, "isInt");
			unit.stub(validator, "isFloat");
			unit.stub(validator, "isAscii");
		});
		
		afterEach(function(){
			validator.isEmail.restore();
			validator.isURL.restore();
			validator.isAlpha.restore();
			validator.isNumeric.restore();
			validator.isAlphanumeric.restore();
			validator.isInt.restore();
			validator.isFloat.restore();
			validator.isAscii.restore();
		});
					
		it("should return true if email param is validated", function(done){

			var param;
			var value;
			var output;
			param="param1";
			value = "value";
			validator.isEmail.withArgs("value").returns(true);

			output = testee.validateParam(param, value, validParams);

			(validator.isEmail.called).should.be.true;
			output.should.be.true;
			done();
		});
		
		it("should return false if email param is not validated", function(done){
			var param;
			var value;
			var output;
			param="param1";
			value = "value";
			validator.isEmail.withArgs("value").returns(false);

			output = testee.validateParam(param, value, validParams);

			(validator.isEmail.called).should.be.true;
			output.should.be.false;
			done();
		});
		
		it("should return true if url param is validated", function(done){
			var param;
			var value;
			var output;
			param="param2";
			value = "value";
			validator.isURL.withArgs("value").returns(true);

			output = testee.validateParam(param, value, validParams);

			(validator.isURL.called).should.be.true;
			output.should.be.true;
			done();
		});
		
		it("should return false if url param is not validated", function(done){
			var param;
			var value;
			var output;
			param="param2";
			value = "value";
			validator.isURL.withArgs("value").returns(false);

			output = testee.validateParam(param, value, validParams);

			(validator.isURL.called).should.be.true;
			output.should.be.false;
			done();
		});
		
		it("should return true if alpha param is validated", function(done){
			var param;
			var value;
			var output;
			param="param3";
			value = "value";
			validator.isAlpha.withArgs("value").returns(true);

			output = testee.validateParam(param, value, validParams);

			(validator.isAlpha.called).should.be.true;
			output.should.be.true;
			done();
		});
		
		it("should return false if alpha param is not validated", function(done){
			var param;
			var value;
			var output;
			param="param3";
			value = "value";
			validator.isAlpha.withArgs("value").returns(false);

			output = testee.validateParam(param, value, validParams);

			(validator.isAlpha.called).should.be.true;
			output.should.be.false;
			done();
		});

		it("should return true if numeric param is validated", function(done){
			var param;
			var value;
			var output;
			param="param4";
			value = "value";
			validator.isNumeric.withArgs("value").returns(true);

			output = testee.validateParam(param, value, validParams);

			(validator.isNumeric.called).should.be.true;
			output.should.be.true;
			done();
		});
		
		it("should return false if numeric param is not validated", function(done){
			var param;
			var value;
			var output;
			param="param4";
			value = "value";
			validator.isNumeric.withArgs("value").returns(false);

			output = testee.validateParam(param, value, validParams);

			(validator.isNumeric.called).should.be.true;
			output.should.be.false;
			done();
		});		

		it("should return true if alphanumeric param is validated", function(done){
			var param;
			var value;
			var output;
			param="param5";
			value = "value";
			validator.isAlphanumeric.withArgs("value").returns(true);

			output = testee.validateParam(param, value, validParams);

			(validator.isAlphanumeric.called).should.be.true;
			output.should.be.true;
			done();
		});
		
		it("should return false if alphanumeric param is not validated", function(done){
			var param;
			var value;
			var output;
			param="param5";
			value = "value";
			validator.isAlphanumeric.withArgs("value").returns(false);

			output = testee.validateParam(param, value, validParams);

			(validator.isAlphanumeric.called).should.be.true;
			output.should.be.false;
			done();
		});		
	
		it("should return true if int param is validated", function(done){
			var param;
			var value;
			var output;
			param="param6";
			value = "value";
			validator.isInt.withArgs("value").returns(true);

			output = testee.validateParam(param, value, validParams);

			(validator.isInt.called).should.be.true;
			output.should.be.true;
			done();
		});
		
		it("should return false if int param is not validated", function(done){
			var param;
			var value;
			var output;
			param="param6";
			value = "value";
			validator.isInt.withArgs("value").returns(false);

			output = testee.validateParam(param, value, validParams);

			(validator.isInt.called).should.be.true;
			output.should.be.false;
			done();
		});		

		it("should return true if float param is validated", function(done){
			var param;
			var value;
			var output;
			param="param7";
			value = "value";
			validator.isFloat.withArgs("value").returns(true);

			output = testee.validateParam(param, value, validParams);

			(validator.isFloat.called).should.be.true;
			output.should.be.true;
			done();
		});
		
		it("should return false if float param is not validated", function(done){
			var param;
			var value;
			var output;
			param="param7";
			value = "value";
			validator.isFloat.withArgs("value").returns(false);

			output = testee.validateParam(param, value, validParams);

			(validator.isFloat.called).should.be.true;
			output.should.be.false;
			done();
		});		

		it("should return true if ascii param is validated", function(done){
			var param;
			var value;
			var output;
			param="param8";
			value = "value";
			validator.isAscii.withArgs("value").returns(true);

			output = testee.validateParam(param, value, validParams);

			(validator.isAscii.called).should.be.true;
			output.should.be.true;
			done();
		});
		
		it("should return false if ascii param is not validated", function(done){
			var param;
			var value;
			var output;
			param="param8";
			value = "value";
			validator.isAscii.withArgs("value").returns(false);

			output = testee.validateParam(param, value, validParams);

			(validator.isAscii.called).should.be.true;
			output.should.be.false;
			done();
		});		

		it("should return false if param is not recognized", function(done){
			var param;
			var value;
			var output;
			param="other";

			output = testee.validateParam(param, value, validParams);

			output.should.be.false;
			done();
		});		
	
	});
});
