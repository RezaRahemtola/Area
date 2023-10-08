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
	callbackUrl  string
}

type Job struct {
	Name        string
	Identifier  string
	containerID string
}

var instance *JobManager

func InitJobManager(cli *client.Client, callbackUrl string, env string) {
	instance = &JobManager{cli, map[string]Job{}, callbackUrl}

	if env == "production" {
		err := instance.cleanContainers()
		if err != nil {
			log.Fatal("Couldn't clean docker environment: ", err)
		}
	}
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
	args = append(args, "--target")
	args = append(args, jm.callbackUrl)
	for key, value := range params {
		args = append(args, "--"+key)
		args = append(args, fmt.Sprint(value))
	}

	cont, err := jm.dockerClient.ContainerCreate(context.Background(), &container.Config{
		Image: JobToImage[name],
		Cmd:   args,
	}, &container.HostConfig{
		NetworkMode: "host",
	}, nil, nil, identifier)

	if err != nil {
		log.Printf("%v", err)
		return err
	}
	err = jm.dockerClient.ContainerStart(context.Background(), cont.ID, types.ContainerStartOptions{})

	jm.jobs[identifier] = Job{
		Name:        name,
		Identifier:  identifier,
		containerID: cont.ID,
	}
	return err
}

func (jm *JobManager) KillJob(identifier string) error {
	job, exists := jm.jobs[identifier]
	if !exists {
		return nil
	}

	err := jm.dockerClient.ContainerStop(context.Background(), job.containerID, container.StopOptions{})
	if err != nil {
		return err
	}

	err = jm.cleanContainer(job.containerID)
	if err != nil {
		return err
	}

	delete(jm.jobs, identifier)
	return nil
}

func (jm *JobManager) ListJobs() map[string]Job {
	return jm.jobs
}

func (jm *JobManager) cleanContainer(containerID string) error {
	return jm.dockerClient.ContainerRemove(context.Background(), containerID, types.ContainerRemoveOptions{})
}

func (jm *JobManager) cleanContainers() error {
	containers, err := jm.dockerClient.ContainerList(context.Background(), types.ContainerListOptions{})

	if err != nil {
		log.Fatal("Couldn't synchronize: ", err)
	}

	for _, cont := range containers {
		if cont.Names[0] != "area_supervisor" {
			err = jm.dockerClient.ContainerStop(context.Background(), cont.ID, container.StopOptions{})
			if err != nil {
				return err
			}
			err = jm.dockerClient.ContainerRemove(context.Background(), cont.ID, types.ContainerRemoveOptions{})
			return err
		}
	}
	return nil
}
