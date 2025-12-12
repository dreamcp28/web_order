# Frontend Dockerfile
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build production version
RUN npm run build || (echo "Build failed, checking errors..." && exit 1)

# Verify build artifacts exist
RUN ls -la /app/dist && \
    test -f /app/dist/index.html && \
    test -d /app/dist/assets && \
    ls -la /app/dist/assets && \
    echo "Build verification successful: files generated"

# Production environment with nginx
FROM nginx:alpine

# Install wget for health checks
RUN apk update && apk add --no-cache wget

# Copy build artifacts to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Verify files are correctly copied
RUN ls -la /usr/share/nginx/html && \
    test -f /usr/share/nginx/html/index.html && \
    test -d /usr/share/nginx/html/assets && \
    echo "File copy verification successful"

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Note: nginx -t is not run here because upstream services (backend, chat-service)
# are not available during build time. Configuration will be validated at runtime.

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
