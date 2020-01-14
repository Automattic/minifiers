FROM node:12.14.0-buster

WORKDIR /box/minifiers
COPY . .
RUN npm install

CMD [ "npm", "start" ]
