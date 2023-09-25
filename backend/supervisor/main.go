package main

import (
	_ "github.com/joho/godotenv/autoload"
	"log"
	"os"
	"strconv"
	"supervisor/grpc"
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

	grpc.InitGrpcServer(port)
}
