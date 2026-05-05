FROM node:20-alpine
WORKDIR /app

# Copy manifests first — maximizes layer cache reuse
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Install production deps only (knex is a prod dep, needed for migrations)
RUN npm ci --workspace=apps/api --workspace=packages/shared --omit=dev

# Copy source
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Make workspace binaries (knex) available without full path
ENV PATH="/app/node_modules/.bin:${PATH}"

WORKDIR /app/apps/api

RUN sed -i 's/\r//' entrypoint.sh && chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["sh", "entrypoint.sh"]
