FROM node:18.18.0-alpine3.18 AS builder

# Create app directory
WORKDIR /app

# Copy dependencies files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Get protobuf files
RUN apk add git protobuf protobuf-dev
RUN git clone https://github.com/RezaRahemtola/area-proto.git proto
RUN mkdir -p ./src/proto ; protoc --plugin=$(npm root)/.bin/protoc-gen-ts_proto --ts_proto_out=src/proto --ts_proto_opt=outputServices=grpc-js --ts_proto_opt=esModuleInterop=true -I=proto/ proto/area_back.proto proto/area_types.proto

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

ENTRYPOINT ["node", "--experimental-specifier-resolution=node", "dist/main.js"]
