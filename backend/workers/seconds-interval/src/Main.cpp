/*
** EPITECH PROJECT, 2023
** AREA
** File description:
** Main.cpp
*/

#include <getopt.h>
#include <iostream>
#include <regex>

#include "SecondsIntervalService.hpp"

bool ParseArguments(int argc, char *argv[], std::string &target, ServiceParams &params) {
    int opt = 0;
    const char* const short_opts = "s:t:w:h";
    const option long_opts[] = {
            {"seconds", required_argument, nullptr, 's'},
            {"target", required_argument, nullptr, 't'},
            {"workflowStepId", required_argument, nullptr, 'w'},
            {"help", no_argument, nullptr, 'h'},
            {nullptr, no_argument, nullptr, 0}
    };

    while (true) {
        opt = getopt_long(argc, argv, short_opts, long_opts, nullptr);

        if (opt == -1) {
            break;
        }

        switch (opt) {
            case 's':
                for (char const &ch : std::string(optarg)) {
                    if (!std::isdigit(ch)) {
                        std::cout << "Invalid seconds number" << std::endl;
                        return false;
                    }
                }
                params.seconds = std::stoi(optarg);
                break;

            case 't':
                target = std::string(optarg);
                break;

            case 'w':
                params.workflowStepId = std::string(optarg);
                break;

            case 'h':
            default:
                std::cout << "Seconds Interval Service" << std::endl;
                std::cout << "--seconds <n>\tNumber of seconds" << std::endl;
                std::cout << "--workflowStepId <id>\tExclusive workflow step id" << std::endl;
                std::cout << "--target <n>\tgRPC Server" << std::endl;
                return false;
        }
    }

    return true;
}

bool CheckArguments(const ServiceParams &params) {
    std::regex component_regex(R"(^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$)");
    std::smatch component_match;

    if (params.seconds < 1) {
        std::cout << "Invalid seconds number" << std::endl;
        return false;
    }
    if (!std::regex_match(params.workflowStepId, component_match, component_regex)) {
        std::cout << "Invalid workflow step id" << std::endl;
        return false;
    }
    return true;
}

int main(int argc, char *argv[])
{
    std::string target = "localhost:50050";
    ServiceParams params;

    if (!ParseArguments(argc, argv, target, params) || !CheckArguments(params)) {
        return EXIT_FAILURE;
    }
    SecondsIntervalService(target, params).runService();
}
