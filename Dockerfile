FROM node:lts-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

EXPOSE 20013

CMD ["node", "./src/app.js"]