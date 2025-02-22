FROM node:21-alpine3.19

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3004

CMD ["npm", "start"]
