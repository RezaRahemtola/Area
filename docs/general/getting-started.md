# Getting started

## Using the deployed application 🖥️

The whole Area application is deployed and accessible by everyone!\
You can use the web version at [`https://area.rezar.fr`](https://area.rezar.fr) to get started with your first workflow 😄

If you would rather use a mobile version of Area, you can use the `Download APK` button at the bottom of the website to use our Android application, which provides the same features and design as the web 🔥

## Using a self-hosted version 🧰

You can also run your own instance of Area, whether you want to change the
code to fit your needs or use your own database to keep full control over
your data 😄

To do this, you'll need to run at least:
- The backend and its database
- The supervisor, with worker images already built
- Either the web frontend, or build the mobile APK to use it on your phone 📱


### Running the backend & database

First, you need to create a `.env` file based on the `.env.example` file, and fill it with your values. You'll especially need to set OAuth tokens for all the integration services you want to use and the database credentials.

> ⚠️ You can also use [Infisical](https://infisical.com) as we are to manage your environment variables. If you don't use it, don't forget to remove the `infisical run` parts in the `package.json`.

Then, you can launch the database using the `docker-compose.yml`:

```sh
docker compose up database -d
```

You can fill it with the base data and apply the migrations with:

```sh
cd backend/back
yarn migration:run
```

and start the backend in production mode:

```sh
docker compose up server -d
```

### Running the frontend

Just as for the backend part, set the values in the `.env` file before starting the app.

> 💡 Also remove Infisical if you are not using it

Make sure you also have set the same environment variables in the `mobile` part, as the APK will be built when launching the web app.

```sh
docker compose up client_web -d
```

If you want to use the mobile app, you can then just download the APK from the web interface.

> 💡 You could also build the APK without the web part, but the whole release build process is already contained in the mobile `Dockerfile`,
it's simpler to use it directly, but you could also build it manually by following a tutorial like [this one](https://medium.com/@xpeho/ci-cd-flutter-avec-github-actions-16aadab8d32d)
