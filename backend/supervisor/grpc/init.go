package grpc

import (
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
	"supervisor/proto"
)

type AreaSupervisorServer struct {
	supervisor.UnimplementedAreaSupervisorServiceServer
}

func InitGrpcServer(port int) {
	tcp, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatal("Cannot listen to port ", port, ": ", err)
	}

	server := grpc.NewServer()
	supervisor.RegisterAreaSupervisorServiceServer(server, &AreaSupervisorServer{})
	fmt.Println("Supervisor gRPC server listening on port", port)
	err = server.Serve(tcp)
	if err != nil {
		log.Fatal("Cannot start server: ", err)
	}
}
