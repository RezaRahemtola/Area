FROM node:18.18.0-alpine3.18 AS builder

# Create app directory
WORKDIR /app

# Copy dependencies files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy protobuf files
RUN apk add git
RUN git clone https://github.com/RezaRahemtola/area-proto.git proto

# Copy source (see .dockerignore)
COPY . .

# Build
RUN yarn build

FROM node:18.18.0-alpine3.18 AS runner

WORKDIR /app

# Non-root user
RUN addgroup -S user \
    && adduser -S user -G user
RUN chown -R user:user /app
USER user

COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/proto ./proto
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

ENTRYPOINT ["sh", "./entrypoint.sh"]
