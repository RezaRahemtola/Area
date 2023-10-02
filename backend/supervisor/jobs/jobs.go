package jobs

import (
	"context"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"log"
)

type JobManager struct {
	dockerClient *client.Client
	jobs         map[string]Job
}

type Job struct {
}

var instance *JobManager

func InitJobManager(cli *client.Client) {
	instance = &JobManager{cli, map[string]Job{}}
}

func GetJobManager() *JobManager {
	return instance
}

func (jm *JobManager) LaunchJob(name string, identifier string, params map[string]interface{}) error {
	_, exists := jm.jobs[name]

	if exists {
		return nil
	}

	var args []string
	for key, value := range params {
		args = append(args, "--"+key)
		args = append(args, fmt.Sprint(value))
	}

	cont, err := jm.dockerClient.ContainerCreate(context.Background(), &container.Config{
		Image: name,
		Cmd:   args,
	}, &container.HostConfig{
		NetworkMode: "host",
	}, nil, nil, identifier)

	if err != nil {
		log.Printf("%v", err)
		return err
	}
	err = jm.dockerClient.ContainerStart(context.Background(), cont.ID, types.ContainerStartOptions{})
	return err
}
