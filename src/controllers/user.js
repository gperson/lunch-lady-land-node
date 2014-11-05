function user(){
  console.log("constructed user controller");
};

function userObj(id, firstName, lastName, email, phone, office, password) {
  this.id = id;
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;
  this.phone = phone;
  this.office = office;
  this.password = password;
};

function createUser(request, response) {
  console.log("creating user");
  
   // TODO: implement create
};

function readUser(request, response) {
  console.log("reading user");
  
  // TODO: get id from url
  var id = 123;
  
  // dummy data
  var u = new userObj(id, 'Spongebob', 'Squarepants', 'bob@xpanxion.com', '555-555-5555', 123, 'squidward');
  var json = JSON.stringify(u);
  console.log("read user json: " + json);
  return json;
};

function updateUser(request, response) {
  console.log("updating user");
  
  // TODO: implement update
};

function deleteUser(request, response) {
  console.log("deleting user");
  
   // TODO: implement delete
};

user.prototype.processRequest = function(request, response) {
  switch(request.method) {
    case "POST":
	  createUser(request, response);
	  break;
	case "GET":
	  readUser(request, response);
	  break;
	case "PUT":
	  updateUser(request, response);
	  break;
	case "DELETE":
	  deleteUser(request, response);
	  break;
	}
};

module.exports = user;