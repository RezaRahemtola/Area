cmake_minimum_required(VERSION 3.8)

project(SecondsIntervalService C CXX)

include(common.cmake)

get_filename_component(proto "area_back.proto" ABSOLUTE)
get_filename_component(proto_path "${proto}" PATH)

set(proto_srcs "${CMAKE_CURRENT_BINARY_DIR}/area_back.pb.cc")
set(proto_hdrs "${CMAKE_CURRENT_BINARY_DIR}/area_back.pb.h")
set(grpc_srcs "${CMAKE_CURRENT_BINARY_DIR}/area_back.grpc.pb.cc")
set(grpc_hdrs "${CMAKE_CURRENT_BINARY_DIR}/area_back.grpc.pb.h")
add_custom_command(
      OUTPUT "${proto_srcs}" "${proto_hdrs}" "${grpc_srcs}" "${grpc_hdrs}"
      COMMAND ${_PROTOBUF_PROTOC}
      ARGS --grpc_out "${CMAKE_CURRENT_BINARY_DIR}"
        --cpp_out "${CMAKE_CURRENT_BINARY_DIR}"
        -I "${proto_path}"
        --plugin=protoc-gen-grpc="${_GRPC_CPP_PLUGIN_EXECUTABLE}"
        "${proto}"
      DEPENDS "${proto}")

include_directories("${CMAKE_CURRENT_BINARY_DIR}")

add_library(grpc_proto
  ${grpc_srcs}
  ${grpc_hdrs}
  ${proto_srcs}
  ${proto_hdrs})
target_link_libraries(grpc_proto
  ${_REFLECTION}
  ${_GRPC_GRPCPP}
  ${_PROTOBUF_LIBPROTOBUF})

add_executable(seconds-interval
        src/Main.cpp
        src/SecondsIntervalService.cpp)

target_link_libraries(seconds-interval
  grpc_proto
  ${_REFLECTION}
  ${_GRPC_GRPCPP}
  ${_PROTOBUF_LIBPROTOBUF})
