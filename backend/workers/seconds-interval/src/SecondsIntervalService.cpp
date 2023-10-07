/*
** EPITECH PROJECT, 2023
** AREA
** File description:
** SecondsIntervalService.cpp
*/

#include <unistd.h>

#include "SecondsIntervalService.hpp"

ServiceParams::ServiceParams(): seconds(0), workflowStepId("") {

}

SecondsIntervalService::SecondsIntervalService(const std::string &target, ServiceParams params): _grpcChannel(grpc::CreateChannel(target, grpc::InsecureChannelCredentials())), _stub(area_back::AreaBackService::NewStub(this->_grpcChannel)), _params(params) {
    std::string id = "seconds-interval-";

    id.append(this->_params.workflowStepId);
    this->_jobId = id;
}

void SecondsIntervalService::runService() {
    JobData data;

    std::unique_ptr<::google::protobuf::Struct> params = std::make_unique<::google::protobuf::Struct>();
    std::unique_ptr<::google::protobuf::Value> secondsVal = std::make_unique<::google::protobuf::Value>();
    std::unique_ptr<::google::protobuf::Value> workflowStepVal = std::make_unique<::google::protobuf::Value>();
    std::unique_ptr<::google::protobuf::Empty> res = std::make_unique<::google::protobuf::Empty>();

    secondsVal->set_number_value(this->_params.seconds);
    workflowStepVal->set_string_value(this->_params.workflowStepId);
    params->mutable_fields()->insert({"seconds", *secondsVal});
    params->mutable_fields()->insert({"workflowStepId", *workflowStepVal});

    data.set_name("seconds-interval");
    data.set_identifier(this->_jobId);
    data.set_allocated_params(params.get());

    while (true) {
        grpc::ClientContext context;
        sleep(this->_params.seconds);

        grpc::Status status = this->_stub->OnAction(&context, data, res.get());

        if (!status.ok()) {
            std::cout << status.error_code() << ": " << status.error_message() << std::endl;
            return;
        }
    }
}
