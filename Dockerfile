FROM node:18-slim

WORKDIR /box/minifiers
COPY . .
RUN npm install

EXPOSE 4747/tcp

CMD [ "node", "server.js" ]
