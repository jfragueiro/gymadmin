# Stage 1: Build Vite app
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN npm ci --workspace=apps/web --workspace=packages/shared

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

RUN npm run build -w apps/web

# Stage 2: Serve static files + proxy /api via Nginx
FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
