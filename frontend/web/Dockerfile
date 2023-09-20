FROM node:18.18.0-alpine3.18 AS deps

WORKDIR /app

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

FROM node:18.18.0-alpine3.18 AS builder

# Create app directory
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=deps /app/node_modules ./node_modules

# Copy source (see .dockerignore)
COPY . .

# Build
RUN yarn build

CMD ["yarn", "start"]
