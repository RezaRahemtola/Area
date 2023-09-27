package grpc

import (
	"context"
	"encoding/json"
	"log"
	supervisor "supervisor/proto"
)

func (s *AreaSupervisorServer) LaunchJob(_ context.Context, in *supervisor.JobData) (*supervisor.Response, error) {
	obj, _ := in.GetParams().MarshalJSON()

	objMap := map[string]interface{}{}
	_ = json.Unmarshal(obj, &objMap)
	log.Printf("ParamsMap: %v", objMap)

	return &supervisor.Response{}, nil
}
