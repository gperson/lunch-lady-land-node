USE `lunch_lady_land` ;

INSERT INTO office(phone, address, name) VALUES
("555-555-5555", "314 Pi St", "North Office"),
("666-555-5555", "271 Euler St", "South Office");

INSERT INTO resturant(name, address, phone, office_id) VALUES
("KFC", "123 Chicken St.","123-345-6789",1),
("Qdoba", "456 Burrito St.","000-345-6789",1),
("Long Title Restuarant and Bar", "123456 S. Easterly St.","123-345-0000",2);

INSERT INTO user(first_name,last_name,email,phone,office_id,password) VALUES
("test","test","test@test.com","555-555-5554",1,"password"),
("Harry","Potter", "hp@hogwarts.com","555-555-5555",2,"password");

INSERT INTO `order`(items_to_order,estimated_cost,desired_time,open,date,resturant_id,user_id) values
("Pizza & chocolate milk",12.65,CURTIME(),TRUE,CURDATE(),1,1),
("Poptarts, Fruit Loops, Beef Jerky",22.50,CURTIME(),TRUE,CURDATE(),1,2),
("Taco, Churro",2.50,CURTIME(),TRUE,CURDATE(),2,2),
("Some realllly good food, Tums",52.50,CURTIME(),TRUE,CURDATE(),3,2);