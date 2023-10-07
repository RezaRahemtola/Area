FROM archlinux:base-devel as builder

WORKDIR /app

RUN pacman -Sy --noconfirm grpc protobuf protobuf-c cmake

COPY . .

RUN mkdir -p ./cmake/build && \
    cd ./cmake/build && \
    cmake -DCMAKE_BUILD_TYPE=Release /app && \
    make && \
    mkdir -p bin && \
    ldd seconds-interval | grep "=> /" | awk '{print $3}' | xargs -I '{}' cp -v '{}' bin/

FROM archlinux:base-devel as runtime

WORKDIR /app

COPY --from=builder /app/cmake/build/seconds-interval .
COPY --from=builder /app/cmake/build/bin /lib

ENTRYPOINT ["./seconds-interval"]
