<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>

<p align="center">
	<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
	<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
	<a href="https://travis-ci.org/Sleeqer/nestjs-saas-boilerplate"><img src="https://travis-ci.org/Sleeqer/nestjs-saas-boilerplate.svg?branch=master" alt="Travis" /></a>
</p>

### 📚 Description

This boilerplate is made to quickly prototype backend saas applications. It comes with authentication, logging, security, and database features out of the box.

---

### 🛠️ Prerequisites

#### Non Docker

- Please make sure to have `MongoDB` , `RabbitMQ` , `Redis` locally.

#### Docker 🐳

- Please make sure to have `docker` setup on any preferred operating system to quickly compose the required dependencies.

---

### 🚀 Deployment

#### Manual Deployment without Docker

- Create a .env file using the `cp .env.example .env` command and replace the existing environment variables with personal configuration settings (username and password database).

- Download dependencies using `npm i` or `yarn`

- Start the app in pre-production mode by using `yarn start` or `yarn start:dev` for development (the app will be exposed on the port 8000).

#### Deploying with Docker 🐳

- Execute the following command in-app directory:

```bash
# creates and loads the docker container in detached mode with the required configuration
$ docker-compose up -d
```

- The following command will set up and run the docker project for quick use. Then the web application, Nginx will be exposed to http://localhost:8000 and http://localhost:80 respectively.

---

### 🔒 Environment Configuration

By default, the application comes with a config module that can read in every environment variable from the `.env` file.

**APPLICATION_NAME** - Application's name

**APPLICATION_PORT** - Application's port , by default it's 8000

**APPLICATION_ENV** - Application's environment , `dev` or `prod`

**APPLICATION_URL** - Application's url

**WEBTOKEN_SECRET_KEY** - JWT token secret key to encrypt / decrypt web tokens with. Make sure to generate a random alphanumeric string for this

**WEBTOKEN_EXPIRATION_TIME** - JWT token expiring time in seconds , by default it's 1209600 seconds which is 14 days

**DB_TYPE** - The type of database

**DB_USERNAME** - Database's username

**DB_PASSWORD** - Database's password

**DB_HOST** - Database's host

**DB_PORT** - Database's port

**DB_DATABASE** - Database's name

**RABBITMQ_HOST** - RabbitMQ's host

**RABBITMQ_PORT** - RabbitMQ's port

**RABBITMQ_USERNAME** - RabbitMQ's username

**RABBITMQ_PASSWORD** - RabbitMQ's password

**RABBITMQ_VHOST** - RabbitMQ's vhost

**RABBITMQ_RECONNECT_TIMEOUT** - RabbitMQ's reconnection interval

**RABBITMQ_EXCHANGE** - RabbitMQ's exchange name

**RABBITMQ_EXCHANGE_TYPE** - RabbitMQ's exchange type

**RABBITMQ_PREFETCH** - RabbitMQ's prefetch time

**REDIS_HOST** - Redis's host

**REDIS_PORT** - Redis's port

**REDIS_USERNAME** - Redis's username

**REDIS_PASSWORD** - Redis's password

**WEBSOCKET_PING_INTERVAL** - Websocket's ping interval

**WEBSOCKET_PING_TIMEOUT** - Websocket's ping timeout

**WEBSOCKET_PORT** - Websocket's port

**WEBSOCKET_PATH** - Websocket's path

**LOGGER_HTTP** - Log http exceptions or not

**LOGGER_DB_TYPE** - The type of database

**LOGGER_DB_USERNAME** - Logger's database username

**LOGGER_DB_PASSWORD** - Logger's database password

**LOGGER_DB_HOST** - Logger's database host

**LOGGER_DB_PORT** - Logger's database port

**LOGGER_DB_DATABASE** - Logger's database name

---

### 🏗 Choosing a Web Framework

This boilerplate comes with [Fastify](https://github.com/fastify/fastify) out of the box as it offers [performance benefits](https://github.com/nestjs/nest/blob/master/benchmarks/all_output.txt) over Express. But this can be changed to use [Express](https://expressjs.com/) framework instead of Fastify. Please proceed with the steps below to change between the two.

If you choose to **use Express**, this command will **install all of the Express dependencies**:

```bash
# installing Express dependencies
$ npm i @nestjs/platform-express express-rate-limit helmet swagger-ui-express @types/express --save
```

Finally remove Fastify dependencies:

```bash
# removing Fastify dependencies
$ npm rm @nestjs/platform-fastify fastify-helmet fastify-rate-limit fastify-swagger --save
```

---

### 💾 Choosing a Database

By default **MongoDB** is the database of choice but TypeORM dependencies are present here to support other database types like SQLite, Postgres, MongoDB, and MSSQL. To use anything other than **MongoDB**, you'll need to configure entities for TypeORM under modules.

---

### ✅ Testing

#### Docker 🐳

```bash
# unit tests
$ docker exec -it nest yarn test

# e2e tests
$ docker exec -it nest yarn test:e2e

# test coverage
$ docker exec -it nest yarn test:cov
```

#### Non-Docker 👽

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

---

### 💡 TypeDocs

The documentation for this boilerplate can be found [on Github pages](https://msanvarov.github.io/nest-rest-typeorm-boilerplate/).

The docs can be generated on-demand, simply, by typing `npm run typedocs`. This will produce a **docs** folder with the required front-end files and **start hosting on [localhost](http://localhost:8080/)**.

```bash
# generate docs for code
$ npm run typedocs
```

---

### 📝 Open API

Out of the box, the web app comes with Swagger; an [open api specification](https://swagger.io/specification/), that is used to describe RESTful APIs. Nest provides a [dedicated module to work with it](https://docs.nestjs.com/recipes/swagger).

The configuration for Swagger can be found at this [location](https://github.com/Sleeqer/nestjs-saas-boilerplate/blob/master/src/main.ts#L12-L61).

---

### ✨ Mongoose

Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box. Please view the [documentation](https://mongoosejs.com) for further details.

The configuration for Mongoose can be found in the [app module](https://github.com/Sleeqer/nestjs-saas-boilerplate/blob/master/src/modules/app/app.module.ts#L17).

---

### 🔊 Logs

This boilerplate comes with a Winston module for logging, the configurations for Winston can be found in the [app module](https://github.com/Sleeqer/nestjs-saas-boilerplate/blob/master/src/modules/app/app.module.ts#L34-L71).

---

## 🚧 Progress

|                                                Branches | Status |
| ------------------------------------------------------: | :----- |
| [Master](https://github.com/Sleeqer/nestjs-saas-boilerplate) | ✅     |

---

### 👥 Support

PRs are appreciated.
Nest is an MIT-licensed open source project with its ongoing development made possible thanks to the support by the community.

---

### 📄 License

Nest is [MIT licensed](LICENSE).

[Author](https://github.com/dorin-musteata)

---

### 💬 Special Thanks

Thanks to [msanvarov](https://github.com/msanvarov/) for the [inspiration](https://github.com/msanvarov/nest-rest-mongo-boilerplate) ;)
