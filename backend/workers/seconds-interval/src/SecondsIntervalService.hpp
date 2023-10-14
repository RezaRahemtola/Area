/*
** EPITECH PROJECT, 2023
** AREA
** File description:
** SecondsIntervalService.hpp
*/

#ifndef SECONDSINTERVALSERVICE_HPP
#define SECONDSINTERVALSERVICE_HPP

#include <grpcpp/grpcpp.h>
#include <memory>
#include "../cmake/build/area_back.grpc.pb.h"

struct ServiceParams {
    public:
        int seconds;
        std::string workflowStepId;

        ServiceParams();
};

class SecondsIntervalService {
    public:
        SecondsIntervalService(const std::string &target, ServiceParams params);
        void runService();

    private:
        std::shared_ptr<grpc::Channel> _grpcChannel;
        std::shared_ptr<area_back::AreaBackService::Stub> _stub;
        const ServiceParams _params;
        std::string _jobId;
};

#endif
