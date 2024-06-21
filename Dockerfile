FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update
RUN apt-get install -y memcached
RUN npm install

COPY . .
EXPOSE 80

CMD [ "npm","start" ]
