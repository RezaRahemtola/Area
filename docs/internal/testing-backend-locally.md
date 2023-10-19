# How to test backend features locally?

Developing backend features in Area can be quite challenging due to the complexity of
the architecture, which is optimized for production and to run on multiple instances.\
This guide aims to simplify the onboarding of new contributors on this part by
providing a detailed & step by step tutorial.

## Setup 💻

### Database

For security purposes, the production database container defined in the main `docker-compose.yml`
is not exposing its ports, which makes it impossible to run it locally with the backend
outside Docker (to benefit from development features such as hot reloading 😉).

That's why a `docker-compose.dev.yaml` was created, which contains everything you don't need
to touch but need to run locally.

You can start the database that is contained in it with the following command:
```sh
docker compose -f docker-compose.dev.yaml up -d
```

and check with `docker ps` that the container is running.

### Supervisor & workers

Now let's dive into the containers for performing actions and reactions.

> 💡 Read the architecture explanations about the [supervisor](architecture/supervisor)
> and [workers](architecture/workers) if you haven't already

First, let's build all the images:

```sh
cd backend/supervisor
docker compose build
```

Then you can run the supervisor:

```sh
docker compose up -d supervisor
```

The jobs container will be created on-demand with calls from the backend when needed,
so for now we don't have much more to do!

### Backend

Before starting our backend, we need to run the migrations & seeding scripts to populate the database.
> 💡 If you have already launched this before and didn't delete the docker volume associated with
> your database, you don't need to do this step again

```sh
cd backend/back
yarn migration:run
```

Then let's start the backend:

```sh
cd backend/back
yarn start:dev
```

If you did all this, the whole Area backend should be up and running on your machine 🎉

Finally, let's launch to UI to visualize our changes!

### Web frontend

Using the web UI can help you test that your changes are well reflected to your end users.
The only thing to do for this is to launch the web part as usual.
> ⚠️ The backend is probably already using the `3000` port so you'll need to
> use a different port for the web interface (defaulting to `3001`)

Make sure to update the `API_URL` environment variable to `http://localhost:3000`, then launch the app:

```sh
cd frontend/web
yarn dev
```

## Testing 🧪

### Backend

This one is the easiest, with hot reloading everything should be visible instantly when you change something 😄

### Workers

With our microservice architecture and on-demand container creation, updating a worker and testing it is a piece of cake 🍰\
Once you've made your changes, simply rebuild the corresponding image using the `docker-compose.yml` in the `supervisor` folder:

```sh
docker compose build <worker-image> --no-cache
```

And that's it! The next workflows that you create or activate will use this new image 🔥\
If you already have a workflow running, you have 2 possibilities depending on the event:

- Action: Since the container is running indefinitely, it will keep using the same image,
so you need to turn the workflow off and on again (or to delete and recreate it)
- Reaction: Reaction containers are created when an action is detected, so nothing do to here!\
Once your image is built, new reactions will be based on it 😄

### Supervisor

If you have to update the supervisor (which is unlikely but can happen sometimes), then your only choice is to stop and running the whole backend.\
This is because the workers depend on the supervisor which create and stop them, and the backend needs to stay connected to it to send instructions.

You can run these commands to restart the backend:
```sh
cd backend/supervisor
docker compose down
docker container prune  # Removes stopped worker containers

# Also stop your backend with CTRL+C

docker compose up supervisor -d --build

cd backend/back
yarn start:dev
```

And you should see the worker containers being recreated directly after this 🚀
