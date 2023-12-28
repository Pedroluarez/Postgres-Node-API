#build from latest version of node
FROM node:latest
 
#create directory
WORKDIR /src/app

#install dependencies
COPY package*.json ./
RUN npm install

#copy files to container
COPY . .
 
#set env variables
COPY .env.example .env

#open port
EXPOSE 8080

#start app
CMD [ "node", "server.js" ]