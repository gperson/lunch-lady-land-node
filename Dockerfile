FROM debian

RUN apt-get -y update 

#Install Node 
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs

ADD . /opt/app
WORKDIR /opt/app
RUN npm install

RUN mkdir /opt/liquibase
RUN tar -zxvf src/liquibase/lib/liquibase-3.3.2-bin.tar.gz -C /opt/liquibase
COPY src/liquibase/lib/mysql-connector-java-5.1.34-bin.jar /opt/liquibase/lib/


RUN apt-get -y install default-jre

CMD ./dockerServerStart.sh

# replace this with your application's default port
EXPOSE 4968