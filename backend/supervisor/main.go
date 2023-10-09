package main

import (
	"fmt"
	"github.com/docker/docker/client"
	_ "github.com/joho/godotenv/autoload"
	"log"
	"os"
	"strconv"
	"supervisor/grpc"
	"supervisor/jobs"
)

func main() {
	port, err := getEnvNumber("GRPC_SERVER_PORT")
	if err != nil {
		log.Fatal("Invalid server port", err)
	}

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Fatal("Cannot create docker client: ", err)
	}

	url := getCallbackUrl()

	jobs.InitJobManager(cli, url)
	grpc.InitGrpcServer(port)
}

func getEnvNumber(env string) (int, error) {
	value := os.Getenv(env)
	return strconv.Atoi(value)
}

func getCallbackUrl() string {
	callbackUrl := os.Getenv("GRPC_CALLBACK_HOST")
	if callbackUrl == "" {
		callbackUrl = "localhost"
	}

	callbackPort, err := getEnvNumber("GRPC_CALLBACK_PORT")
	if err != nil {
		fmt.Println("Invalid callback port, defaulting to 50050")
		callbackPort = 50050
	}

	return callbackUrl + ":" + fmt.Sprint(callbackPort)
}
