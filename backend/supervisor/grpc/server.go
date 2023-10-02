package grpc

import (
	"context"
	"encoding/json"
	"supervisor/jobs"
	supervisor "supervisor/proto"
)

func (s *AreaSupervisorServer) LaunchJob(_ context.Context, in *supervisor.JobData) (*supervisor.Response, error) {
	obj, err := in.GetParams().MarshalJSON()
	if err != nil {
		return newServerError(err), nil
	}

	objMap := map[string]interface{}{}
	err = json.Unmarshal(obj, &objMap)
	if err != nil {
		return newServerError(err), nil
	}

	err = jobs.GetJobManager().LaunchJob(in.GetName(), in.GetIdentifier(), objMap)
	if err != nil {
		return newServerError(err), nil
	}
	return &supervisor.Response{}, nil
}

func newServerError(err error) *supervisor.Response {
	return &supervisor.Response{
		Error: &supervisor.Error{
			Code:    500,
			Message: err.Error(),
		},
	}
}
