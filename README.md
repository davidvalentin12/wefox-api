# wefox-api

Wefox coding challenge. NodeJS/Typescript-GoogleMaps/OpenWeather-API.
## Prerequisites

- Install [Docker](https://docs.docker.com/engine/install/)
- Install [Node.js](https://nodejs.org/)

## Setup

Build and start containers with `docker-compose` in detached mode.

```
docker-compose up -d
```

Connect to the `server` container:

```
docker exec -it server /bin/bash
```

Once inside, you can execute different commands to `start`, `test`, `lint` the application.

## Development

Run development mode with:
```
npm run dev
```
- `Nodemon` will start the application and restart it on changes made in the `src` folder.
## Testing

Run unit tests with:

```
npm run test
```

## Production

Execute production mode with:

```
npm run start
```

## Documentation: Swagger

With `npm run start` or `npm run dev` you can go to:

```
http://localhost:3000/api-docs/
```
to test all the endpoints with ease.