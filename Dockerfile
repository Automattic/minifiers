FROM node:18.14.0-slim

WORKDIR /box/minifiers
COPY . .
RUN npm install

EXPOSE 4747/tcp

CMD [ "node", "server.js" ]
