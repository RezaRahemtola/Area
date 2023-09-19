FROM node:18.17.1-alpine3.18 AS builder

ARG build_context

# Create app directory
WORKDIR /app

# Copy dependencies files
COPY package.json yarn.lock ./
COPY $build_context/package.json ./$build_context/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source (see .dockerignore)
COPY ./$build_context/ ./$build_context/

# Build
RUN yarn workspace back build

FROM node:18.17.1-alpine3.18 AS runner

ARG build_context

WORKDIR /app

COPY --from=builder /app/$build_context/dist ./
COPY --from=builder /app/node_modules ./node_modules

CMD [ "node", "src/main.js" ]
