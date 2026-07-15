FROM node:20-alpine

# Always pull the latest Alpine security patches at build time
# This keeps OS-level packages (like libssl3/libcrypto3) patched on every build
RUN apk update && apk upgrade --no-cache

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