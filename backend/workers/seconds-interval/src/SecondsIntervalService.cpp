/*
** EPITECH PROJECT, 2023
** AREA
** File description:
** SecondsIntervalService.cpp
*/

#include <unistd.h>

#include "SecondsIntervalService.hpp"

SecondsIntervalService::SecondsIntervalService(const std::string &target, int seconds): _grpcChannel(grpc::CreateChannel(target, grpc::InsecureChannelCredentials())), _stub(area_back::AreaBackService::NewStub(this->_grpcChannel)), _seconds(seconds) {

}

void SecondsIntervalService::runService() {
    area_back::AreaData data;

    ::google::protobuf::Struct *params = new ::google::protobuf::Struct();
    ::google::protobuf::Value *val = new ::google::protobuf::Value();
    ::google::protobuf::Empty *empty = new ::google::protobuf::Empty();


    val->set_number_value(this->_seconds);
    params->mutable_fields()->insert({"seconds", *val});
    data.set_allocated_params(params);

    while (true) {
        grpc::ClientContext context;
        sleep(this->_seconds);
        grpc::Status status = this->_stub->OnAction(&context, data, empty);

        if (!status.ok()) {
            std::cout << status.error_code() << ": " << status.error_message() << std::endl;
            return;
        }
    }
}
