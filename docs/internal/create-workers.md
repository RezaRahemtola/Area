# Creating workers

## Introduction

The [workers](/architecture/workers) are the core of the project: their goal is to fetch data from external services and send it to the backend.

They are running in a Docker container, and are launched by the [supervisor](/architecture/supervisor) when a job is created.

## Step 1: Create a new worker

The first step is to create a new worker in the [workers](/workers) directory.

```bash
cd backend/workers
mkdir my-worker
```

You can then use the language / framework you want to create your worker.

### Arguments handling

Your worker will receive arguments, using `argv`.\
The syntax of the arguments is the following: `--key value`

:warn: There are 3 special parameters that are injected by the supervisor:
- `--auth`: Authentication data (formatted JSON: you might need an extra package to parse it)
- `--identifier`: The unique identifier of the job
- `--target`: URI of the backend for the gRPC communication

### Error handling

If an error occurs, you must send it to the backend using the [OnError](../architecture/workers.md#onerror) gRPC route.

### Dockerisation

The last step of the creation of a *worker* is to create a Dockerfile to build it.

The Dockerfile must be located in the root of the worker directory.

You also have to register your worker in the [Supervisor docker-compose.yaml](https://github.com/RezaRahemtola/Area/tree/main/backend/supervisor/docker-compose.yml).

## Step 2: Create a new AREA

The second step is to create one or several AREAs for your worker.

### Job identifiers

To register a job, please add it to the following files:

- The jobs list in the backend: [jobs.ts](https://github.com/RezaRahemtola/Area/tree/main/backend/back/src/types/jobs.ts)
> You can create a template class that will be automatically validated in the [jobParams.ts file](https://github.com/RezaRahemtola/Area/tree/main/backend/back/src/types/jobParams.ts)

- The jobs identifier factory: [jobIds.ts](https://github.com/RezaRahemtola/Area/tree/main/backend/back/src/types/jobIds.ts)
> :warn: The job identifier factory is used to generate the unique identifier of a job. It must be unique for every different job. (See [Jobs identification](../architecture/supervisor.md#jobs-identification))

- The [supervisor data](https://github.com/RezaRahemtola/Area/tree/main/backend/supervisor/jobs/images.go) in the supervisor
> :bulb: The JobToImage map associates the job name to the name of the Docker image to use to run the job, which is in most cases `supervisor-{yourWorker}`.

> The OptArg map associates the job name to the first argument, which can be used by your worker to determine which job to launch.

### Database migration

Finally, you need to create a database migration to add the new area(s) to the database.

You need to insert rows in the `areas` table, with the following columns:

- `name`: The name of the area
- `description`: The description of the area
- `service_id`: The ID of the area's service
- `is_action`: `true` if the area is an action, `false` if it's a reaction
- `parameters_form_flow`: The parameters that can be sent to your job (see below)
- `parameters_return_flow`: The parameters that are sent back by your job (see below)

If your job needs an *OAuth* authentication and specific scopes, you need to insert them in the `area_service_scopes_needed_service_scopes` table.

- `area_id`: The ID of the area
- `area_service_id`: The ID of the area's service
- `service_scope_id`: The needed scope
- `service_scope_service_id`: The ID of the area's service

Please insert as many rows as needed, one for each scope.

> :warn: No authentication scopes mean that your job doesn't need an authentication.

### Parameters

#### Parameters form flow

The parameters form flow is used to generate the form that will be displayed to the user when creating a job.

You must use the following JSON format:

```json
[
    {
        name: string
        type: string
        required: boolean,
        values?: string[]
    }
]
```

> :bulb: The supported types are available [here](https://github.com/RezaRahemtola/Area/tree/main/backend/back/src/services/dto/area.dto.ts)

> The `values` property is only needed for the `select` type.

#### Parameters return flow

The parameters return flow is the list of the keys your job will return in the `data` property of the [OnAction / OnReaction gRPC routes](../architecture/workers.md#onaction--onreaction).
