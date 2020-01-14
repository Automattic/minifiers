FROM node:12.14.0-slim

WORKDIR /box/minifiers
COPY . .
RUN npm install

CMD [ "npm", "start" ]
