
#Refresh run the liquibase update on linked db server with alias db

cd liquibase
/opt/liquibase/liquibase --url=jdbc:mysql://db:3306/lunch_lady_land update
cd ..

#Start the application
node LunchLadyLandServer.js db
