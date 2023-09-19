FROM node:18.18.0-alpine3.18 AS builder

# Create app directory
WORKDIR /app

# Copy dependencies files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source (see .dockerignore)
COPY . .

# Build
RUN yarn build

CMD ["yarn", "start"]
