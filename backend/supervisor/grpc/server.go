package grpc

import (
	"context"
	"google.golang.org/protobuf/types/known/emptypb"
	"log"
	supervisor "supervisor/proto"
)

func (s *AreaWorkerServiceServer) LaunchJob(_ context.Context, in *supervisor.AreaData) (*emptypb.Empty, error) {
	log.Printf("Received: %v", in.GetName())
	log.Printf("Params: %v", in.GetParams())
	return &emptypb.Empty{}, nil
}
