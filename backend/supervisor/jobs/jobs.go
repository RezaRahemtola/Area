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
	production   bool
	jobsCount    int
}

type Job struct {
	Name        string
	Identifier  string
	containerID string
}

var instance *JobManager

func InitJobManager(cli *client.Client, callbackUrl string, env string) {
	instance = &JobManager{cli, map[string]Job{}, callbackUrl, env == "production", 0}

	err := instance.cleanContainers()
	if err != nil {
		log.Fatal("Couldn't clean docker environment: ", err)
	}
}

func GetJobManager() *JobManager {
	return instance
}

func (jm *JobManager) LaunchJob(name string, identifier string, params map[string]interface{}, auth []byte) error {
	_, exists := jm.jobs[identifier]
	if exists {
		_, err := jm.dockerClient.ContainerInspect(context.Background(), jm.jobs[name].containerID)

		if err != nil {
			delete(jm.jobs, identifier)
		} else {
			log.Printf("Job %s already running\n", identifier)
			return nil
		}
	}

    // TODO Reza: remove debug auth
    log.Printf("auth %s", auth)
	var args []string
	optarg := OptArgument[name]
	if optarg != "" {
		args = append(args, optarg)
	}
	args = append(args, "--target")
	args = append(args, jm.callbackUrl)
	args = append(args, "--identifier")
	args = append(args, identifier)
	args = append(args, "--auth")
	args = append(args, string(auth))
	for key, value := range params {
		args = append(args, "--"+key)
		args = append(args, fmt.Sprint(value))
	}

	cont, err := jm.dockerClient.ContainerCreate(context.Background(), &container.Config{
		Image: JobToImage[name],
		Cmd:   args,
	}, &container.HostConfig{
		NetworkMode: "host",
		AutoRemove:  jm.production,
	}, nil, nil, jm.generateContainerName(identifier))

	if err != nil {
		log.Printf("Error when creating job %s: %v\n", identifier, err)
		return err
	}

	err = jm.dockerClient.ContainerStart(context.Background(), cont.ID, types.ContainerStartOptions{})
	if err != nil {
		log.Printf("Error when launching job %s: %v\n", identifier, err)
		return err
	}

	jm.jobs[identifier] = Job{
		Name:        name,
		Identifier:  identifier,
		containerID: cont.ID,
	}
	jm.jobsCount += 1
	log.Printf("Job %s launched", identifier)
	return nil
}

func (jm *JobManager) KillJob(identifier string) error {
	job, exists := jm.jobs[identifier]
	if !exists {
		log.Printf("Job %s not running\n", identifier)
		return nil
	}

	_, err := jm.dockerClient.ContainerInspect(context.Background(), job.containerID)
	if err != nil {
		log.Printf("Job %s not running\n", identifier)
		delete(jm.jobs, identifier)
		return nil
	}

	err = jm.dockerClient.ContainerStop(context.Background(), job.containerID, container.StopOptions{})
	if err != nil {
		log.Printf("Error when stopping job %s: %v\n", identifier, err)
		return err
	}

	if jm.production {
		err = jm.dockerClient.ContainerRemove(context.Background(), job.containerID, types.ContainerRemoveOptions{})
		if err != nil {
			log.Printf("Error when removing job %s: %v\n", identifier, err)
			return err
		}
	}

	delete(jm.jobs, identifier)
	log.Printf("Job %s killed\n", identifier)
	return nil
}

func (jm *JobManager) ListJobs() map[string]Job {
	return jm.jobs
}

func (jm *JobManager) cleanContainers() error {
	containers, err := jm.dockerClient.ContainerList(context.Background(), types.ContainerListOptions{
		All: true,
	})

	if err != nil {
		log.Printf("Error when listing containers: %v\n", err)
		return err
	}

	errors := make([]error, 0)
	for _, cont := range containers {
		if cont.Image != "area_supervisor" && isSupervisorContainer(cont.Image) {
			err = jm.dockerClient.ContainerStop(context.Background(), cont.ID, container.StopOptions{})
			if err != nil {
				errors = append(errors, err)
			}

			_ = jm.dockerClient.ContainerRemove(context.Background(), cont.ID, types.ContainerRemoveOptions{})
		}
	}
	if len(errors) > 0 {
		log.Printf("Error: %d containers could not be stopped\n", len(errors))
		for _, err := range errors {
			log.Printf("Error: %v\n", err)
		}
		return fmt.Errorf("%d containers could not be stopped", len(errors))
	}
	return nil
}

func (jm *JobManager) generateContainerName(identifier string) string {
	if jm.production {
		return identifier
	}
	return fmt.Sprintf("%s-%d", identifier, jm.jobsCount)
}

func isSupervisorContainer(image string) bool {
	for _, a := range GetImages() {
		if a == image {
			return true
		}
	}
	return false
}
