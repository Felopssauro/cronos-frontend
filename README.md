# SCA UEPA (Frontend) - Sistema Cronos de Alocação

<!--toc:start-->
- [SCA UEPA (Frontend) - Sistema Cronos de Alocação](#sca-uepa-frontend-sistema-cronos-de-alocação)
  - [Description](#description)
  - [Languages](#languages)
  - [English (en-us)](#english-en-us)
    - [Dependencies](#dependencies)
    - [Tools](#tools)
    - [Initial setup](#initial-setup)
    - [Essential commands](#essential-commands)
      - [Running other commands inside containers](#running-other-commands-inside-containers)
      - [Git](#git)
      - [Docker and Docker Compose](#docker-and-docker-compose)
        - [Building the environment](#building-the-environment)
        - [Handling containers and images](#handling-containers-and-images)
      - [Frontend](#frontend)
  - [Portugês (pt-br)](#portugês-pt-br)
<!--toc:end-->

## Description

SCA UEPA is a web app built with NestJS + Prisma for the backend and React + Vite for the user interface. The goal is to provide a simple and effective way to manage the allocation of rooms in the State University of Pará.

This repository is for the frontend development of SCA UEPA.

## Languages

- [English (en-us)](#english-en-us)
- [Português (pt-br)](#português-pt-br)

## English (en-us)

### Dependencies

To run this project it is recommend you have the following dependencies installed on your machine:

- `git`
- `docker`
- `docker-compose`

### Tools

- React + Vite for the user interface development.
- Docker and Docker compose for multi-service dev/prod setups.

### Initial setup

- Clone the repository:
  - `git clone https://github.com/Felopssauro/sca-frontend.git`
- Provide environment variables inside a .env file for Docker Compose:
  - `VITE_API_BASE_URL`: this is the link that makes the connection of the frontend with the backend.
    - For localhost development, set this variable to: `http://localhost:3000`
  - You can also write a `COMPOSE_FILE` variable with the name of the docker compose file you will be using the most, so you don't have to manually pass the `-f` flag every time.
    - e.g: `COMPOSE_FILE=docker-compose.dev.yml`
  - Build the containers with docker compose:
    - For development:
      - `docker compose -f docker-compose.dev.yml up --build -d`

Now you have a complete setup for development with running containers.

You can access the development frontend at `http://localhost:5173`

### Essential commands

All commands are explained assuming you are running them from the root directory `sca-frontend/`

#### Running other commands inside containers

It is important to run all `npm` and `npx prisma` commands inside the containers, because this is where all the installed dependencies will be.

- format: `docker compose -f <docker-compose.name.yml> exec npm run lint`
  - e.g.: `docker compose -f docker-compose.dev.yml exec npm run lint`

#### Git

- `git checkout dev`: change your work branch to dev.
- `git pull origin dev`: fetch and merge the latest changes of this repository
- `git push origin dev`: push your commits to the dev branch on you remote repository

#### Docker and Docker Compose

When running commands using docker compose, you will have to use `-f` flag to select the specific compose file you will be using on the command. You will to add this every time you run a docker compose command.

##### Building the environment

- For development:
  - `docker compose -f docker-compose.dev.yml up --build -d`
- For production (not tested yet):
  - `docker compose -f docker-compose.prod.yml up --build -d`

##### Handling containers and images

- `docker compose -f <docker-compose.name.yml> exec`: executes commands inside the container
- `docker compose -f <docker-compose.name.yml> stop`: stop containers built with compose file.
- `docker compose -f <docker-compose.name.yml> up`: start containers built with compose file.
- `docker compose -f <docker-compose.name.yml> rm -f`: force removes stopped containers built with compose file.
- `docker compose -f <docker-compose.name.yml> down -v`: removes the containers and
networks for that compose file and deletes named volumes
- `docker image ls`: list docker images
- `docker image rm <image-id-or-name>`: remove docker images

#### Frontend

- `npm run dev`: Vite dev server.
- `npm run build`: Production build.
- `npm run lint`: ESLint.
- `npm run preview`: Preview production build.

## Portugês (pt-br)
