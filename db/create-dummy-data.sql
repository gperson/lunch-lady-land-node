USE `lunch_lady_land` ;

INSERT INTO office(phone, address, name) VALUES
("555-555-5555", "314 Pi St", "North Office"),
("666-555-5555", "271 Euler St", "South Office");

INSERT INTO resturant(name, address, phone, office_id) VALUES
("KFC", "123 Chicken St.","123-345-6789",1),
("Qdoba", "456 Burrito St.","000-345-6789",1),
("Long Title Restuarant and Bar", "123456 S. Easterly St.","123-345-0000",2);