FROM node:20-alpine

WORKDIR /app

# Install root deps (client + concurrently)
COPY package*.json ./
RUN npm install

# Install server deps
COPY server/package*.json ./server/
RUN npm install --prefix server

# Copy everything else
COPY . .

EXPOSE 5173 3001

CMD ["npm", "run", "dev"]
