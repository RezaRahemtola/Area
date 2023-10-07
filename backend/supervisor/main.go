package main

import (
	"github.com/docker/docker/client"
	_ "github.com/joho/godotenv/autoload"
	"log"
	"os"
	"strconv"
	"supervisor/grpc"
	"supervisor/jobs"
)

func GetEnvNumber(env string) (int, error) {
	value := os.Getenv(env)
	return strconv.Atoi(value)
}

func main() {
	port, err := GetEnvNumber("GRPC_SERVER_PORT")
	if err != nil {
		log.Fatal("Invalid server port", err)
	}

	callbackUrl, err := os.Getenv("GRPC_CALLBACK_URL")
	if err != nil {
	    log.Fatal("Invalid callback url", err)
	}

	callbackPort, err := GetEnvNumber("GRPC_CALLBACK_PORT")
	if err != nil {
	    log.Fatal("Invalid callback port", err)
	}

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Fatal("Cannot create docker client: ", err)
	}

	jobs.InitJobManager(cli)
	grpc.InitGrpcServer(port)
}
