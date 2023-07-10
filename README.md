# Open Music API

This readme provides an overview and instructions for setting up the Open Music API project using Hapi.js, Redis, PostgreSQL, and RabbitMQ.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Open Music API project is a RESTful API that allows users to manage and access music data. It is built using Hapi.js as the server framework, Redis for caching, PostgreSQL as the database, and RabbitMQ for message queuing.

## Prerequisites

Before setting up the project, make sure you have the following prerequisites installed:

- Node.js and npm
- Redis
- PostgreSQL
- RabbitMQ

## Installation

1. Clone the repository: `git clone https://github.com/ikhsan3adi/open-music-api.git`
2. Navigate to the project directory: `cd open-music-api`
3. Install the dependencies: `npm install`

## Configuration

1. Create a `.env` file in the project root directory.
2. Configure the following environment variables in the `.env` file:
   - `HOST` : The hostname of the server.
   - `PORT` : The port on which the server will run.
   - `PGHOST` : The hostname of the PostgreSQL database.
   - `PGPORT` : The port number of the PostgreSQL database.
   - `PGDATABASE` : The name of the PostgreSQL database.
   - `PGUSER` : The username for accessing the PostgreSQL database.
   - `PGPASSWORD` : The password for accessing the PostgreSQL database.
   - `REDIS_SERVER` : The hostname of the Redis server.
   - `RABBITMQ_SERVER` : The hostname of the RabbitMQ server.

## Usage

To start the server, run the following command: `npm start`

## Endpoints

The Open Music API provides the following endpoints:

- `GET /songs` : Get a list of all songs.
- `GET /songs/{songId}` : Get details of a specific song.
- `POST /songs` : Add a new song.
- `PUT /songs/{songId}` : Update details of a specific song.
- `DELETE /songs/{songId}` : Delete a specific song.

Other endpoints coming soon!
