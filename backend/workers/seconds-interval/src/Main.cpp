/*
** EPITECH PROJECT, 2023
** AREA
** File description:
** Main.cpp
*/

#include <getopt.h>
#include <iostream>

#include "SecondsIntervalService.hpp"

bool ParseArguments(int argc, char *argv[], int &seconds, std::string &target) {
    int opt = 0;
    const char* const short_opts = "s:t:h";
    const option long_opts[] = {
            {"seconds", required_argument, nullptr, 'n'},
            {"target", required_argument, nullptr, 't'},
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
                seconds = std::stoi(optarg);
                break;

            case 't':
                target = std::string(optarg);
                break;

            case 'h':
            default:
                std::cout << "Seconds Interval Service" << std::endl;
                std::cout << "--seconds <n>\tNumber of seconds" << std::endl;
                std::cout << "--target <n>\tgRPC Server" << std::endl;
                return false;
        }
    }

    return true;
}

int main(int argc, char *argv[])
{
    std::string target = "localhost:50050";
    int seconds = 0;

    if (!ParseArguments(argc, argv, seconds, target)) {
        return EXIT_FAILURE;
    }
    if (seconds < 1) {
        std::cout << "Invalid seconds number" << std::endl;
        return EXIT_FAILURE;
    }

    SecondsIntervalService(target, seconds).runService();
}
