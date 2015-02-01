FROM node:0.10-onbuild

RUN mkdir /opt/liquibase
RUN tar -zxvf liquibase/lib/liquibase-3.3.2-bin.tar.gz -C /opt/liquibase
COPY /liquibase/lib/mysql-connector-java-5.1.34-bin.jar /opt/liquibase/lib/

RUN apt-get -y update 
RUN apt-get -y install default-jre

CMD ./dockerServerStart.sh

# replace this with your application's default port
EXPOSE 4968