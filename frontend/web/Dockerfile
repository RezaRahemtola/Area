FROM node:18.17.1-alpine3.18 AS builder

ARG build_context

# Create app directory
WORKDIR /app

# Copy dependencies files
COPY package.json yarn.lock ./
COPY $build_context/package.json ./frontend/web/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source (see .dockerignore)
COPY ./$build_context ./$build_context

# Build
RUN yarn workspace front build

FROM node:18.17.1-alpine3.18 AS runner

ARG build_context

WORKDIR /app

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/$build_context/.next/standalone ./standalone
COPY --from=builder /app/$build_context/public ./standalone/public
COPY --from=builder /app/$build_context/.next/static ./standalone/.next/static

CMD ["node", "./standalone/frontend/web/server.js"]
