# Workers

Workers are Docker containers that are launched by the [supervisor](./supervisor.md) in order to execute Actions and Reactions.

The workers don't communicate in any form with the supervisor. They communicate directly with the backend to send data and errors.


The purpose of using Docker containers is to be able to run any language or framework in the workers. It allows the development team to use the SDKs provided by the services to fetch data, and to use any language to execute actions without having to install anything on their machine.

## Requirements

There are only two requirements for the workers:

- The worker can run in a **Docker container** and has a Dockerfile to build it
- The chosen language has a **gRPC** implementation allowing it to send data to the backend

## Requests



The supervisor responds to the following requests:

### OnAction / OnReaction

The OnAction and OnReaction routes are used to send data to the backend, which will trigger the workflows attached to the following action or reaction.

The data sent to the backend must be in the following format:

```json
{
  "name": "job-name",
  "identifier": "job-identifier",
  "data": {
    "key": "value"
  }
}
```

### OnError

When an error occurs when fetching data, the worker can use the OnError route to send the error to the backend.

:warn: WIP. A better handling of errors in the backend is in progress.

Depending on the received error, the parameter `isAuthError` can be used to notify the backend that the error has been caused by the provided credentials.
