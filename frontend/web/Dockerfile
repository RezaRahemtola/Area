FROM node:18.17.1-alpine3.18 AS builder

# Create app directory
WORKDIR /app

# Copy dependencies files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source (see .dockerignore)
COPY . .

# Build
RUN yarn workspace front build

FROM node:18.17.1-alpine3.18 AS runner

WORKDIR /app

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/public ./standalone/public
COPY --from=builder /app/.next/static ./standalone/.next/static

CMD ["node", "./standalone/frontend/web/server.js"]
