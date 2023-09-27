package grpc

import (
	"context"
	"log"
	supervisor "supervisor/proto"
)

func (s *AreaSupervisorServer) LaunchJob(_ context.Context, in *supervisor.JobData) (*supervisor.Response, error) {
	log.Printf("Received: %v (id %v)", in.GetName(), in.GetIdentifier())
	log.Printf("Params: %v", in.GetParams())

	if in.GetParams() == nil {
		log.Printf("Nil map")
	}

	return &supervisor.Response{}, nil
}
