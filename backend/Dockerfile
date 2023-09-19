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
RUN yarn workspace back build

FROM node:18.17.1-alpine3.18 AS runner

WORKDIR /app

COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules ./node_modules

CMD [ "node", "src/main.js" ]
