FROM node:16.13-alpine

WORKDIR /app

COPY . /app

EXPOSE 8083

CMD ["yarn", "dev"]
