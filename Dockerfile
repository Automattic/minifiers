FROM node:22-slim

WORKDIR /box/minifiers
COPY . .
RUN npm install

EXPOSE 4747/tcp

CMD [ "node", "server.js" ]
