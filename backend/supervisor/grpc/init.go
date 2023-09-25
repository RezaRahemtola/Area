package grpc

import (
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
	"supervisor/proto"
)

type AreaWorkerServiceServer struct {
	supervisor.UnimplementedAreaWorkerServiceServer
}

func InitGrpcServer(port int) {
	tcp, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatal("Cannot listen to port ", port, ": ", err)
	}

	server := grpc.NewServer()
	supervisor.RegisterAreaWorkerServiceServer(server, &AreaWorkerServiceServer{})
	fmt.Println("Supervisor gRPC server listening on port", port)
	err = server.Serve(tcp)
	if err != nil {
		log.Fatal("Cannot start server: ", err)
	}
}
