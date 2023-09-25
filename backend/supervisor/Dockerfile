FROM golang:1.21.1-alpine3.18 AS builder

# Create app directory
WORKDIR /app

# Copy dependencies files
COPY go.mod .
COPY go.sum .

# Install dependencies
RUN go mod download

# Install protoc
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.27.1
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1.0

# Get proto files
RUN apk add git protobuf protobuf-dev
RUN git clone https://github.com/RezaRahemtola/area-proto.git proto
RUN protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/area_supervisor.proto

# Copy source (see .dockerignore)
COPY . .

# Build
RUN go build

FROM alpine:3.18 AS runner

WORKDIR /app

COPY --from=builder /app/supervisor ./

CMD [ "./supervisor" ]
