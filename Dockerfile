FROM node:16-stretch as base

COPY . ./app

WORKDIR /app

RUN npm install
RUN npm run build

EXPOSE 3000