FROM node:18-alpine

# PC/SC middleware + CCID driver for ACR122U
RUN apk add --no-cache pcsc-lite pcsc-lite-libs ccid

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

EXPOSE 3000

# Start pcscd in background, then Node
CMD ["sh", "-c", "pcscd --foreground --debug & sleep 2 && exec node src/server.js"]
