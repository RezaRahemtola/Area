package grpc

import (
	"context"
	"encoding/json"
	"google.golang.org/protobuf/types/known/emptypb"
	"supervisor/jobs"
	"log"
	supervisor "supervisor/proto"
)

func (s *AreaSupervisorServer) LaunchJob(_ context.Context, in *supervisor.AuthenticatedJobData) (*supervisor.Response, error) {
	obj, err := in.GetParams().MarshalJSON()
	if err != nil {
		return newServerError(err), nil
	}

    // TODO: Reza remove debug auth
    log.Printf("%s", in.GetAuth())
	creds, err := in.GetAuth().MarshalJSON()
	if err != nil {
		return newServerError(err), nil
	}

	objMap := map[string]interface{}{}
	err = json.Unmarshal(obj, &objMap)
	if err != nil {
		return newServerError(err), nil
	}

	err = jobs.GetJobManager().LaunchJob(in.GetName(), in.GetIdentifier(), objMap, creds)
	if err != nil {
		return newServerError(err), nil
	}
	return &supervisor.Response{}, nil
}

func (s *AreaSupervisorServer) KillJob(_ context.Context, in *supervisor.JobId) (*supervisor.Response, error) {
	err := jobs.GetJobManager().KillJob(in.GetIdentifier())
	if err != nil {
		return newServerError(err), nil
	}
	return &supervisor.Response{}, nil
}

func (s *AreaSupervisorServer) KillAllJobs(_ context.Context, _ *emptypb.Empty) (*supervisor.Response, error) {
	for _, job := range jobs.GetJobManager().ListJobs() {
		err := jobs.GetJobManager().KillJob(job.Identifier)
		if err != nil {
			return newServerError(err), nil
		}
	}
	return &supervisor.Response{}, nil
}

func (s *AreaSupervisorServer) ListJobs(_ context.Context, _ *emptypb.Empty) (*supervisor.JobList, error) {
	list := supervisor.JobList{}
	for _, job := range jobs.GetJobManager().ListJobs() {
		list.Jobs = append(list.Jobs, &supervisor.Job{
			Name:       job.Name,
			Identifier: job.Identifier,
		})
	}
	return &list, nil
}

func newServerError(err error) *supervisor.Response {
	return &supervisor.Response{
		Error: &supervisor.Error{
			Code:    500,
			Message: err.Error(),
		},
	}
}
