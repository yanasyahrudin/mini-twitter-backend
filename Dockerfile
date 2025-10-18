# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install build dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild native modules
RUN npm ci --only=production && npm rebuild bcrypt --build-from-source

# Copy application files
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
