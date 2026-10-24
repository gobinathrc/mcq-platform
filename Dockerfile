FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and package definitions
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install all dependencies
RUN npm run install:all

# Copy source files
COPY backend ./backend
COPY frontend ./frontend

# Build frontend and backend
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 10000

CMD ["npm", "start", "--prefix", "backend"]
