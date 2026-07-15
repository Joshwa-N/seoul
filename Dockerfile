FROM node:20-alpine

RUN apk update && apk upgrade --no-cache && \
    npm install -g npm@11

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY server/package*.json ./server/
RUN npm install --prefix server

COPY . .

EXPOSE 5173 3001

CMD ["npm", "run", "dev"]