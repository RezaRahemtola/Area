FROM archlinux:base-devel AS builder

WORKDIR /app

RUN pacman -Sy --noconfirm grpc protobuf protobuf-c cmake git

RUN git clone https://github.com/RezaRahemtola/area-proto.git proto

COPY . .

RUN mkdir -p ./cmake/build && \
    cd ./cmake/build && \
    cmake -DCMAKE_BUILD_TYPE=Release /app && \
    make && \
    mkdir -p bin && \
    ldd seconds-interval | grep "=> /" | awk '{print $3}' | xargs -I '{}' cp -v '{}' bin/

FROM archlinux:base-devel AS runtime

WORKDIR /app

# Non-root user
RUN addgroup -S user \
    && adduser -S user -G user
RUN chown -R user:user /app
USER user

COPY --from=builder /app/cmake/build/seconds-interval .
COPY --from=builder /app/cmake/build/bin /lib

ENTRYPOINT ["./seconds-interval"]
