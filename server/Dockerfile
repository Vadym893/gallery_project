
FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y python3 build-essential

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm install -g nodemon

EXPOSE 5000

CMD ["nodemon", "server.js"]