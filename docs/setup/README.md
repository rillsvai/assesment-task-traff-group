# Cloak Service

## Setup dev environment

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)


Follow the steps below to set up the project:

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm ci
```

### 3. Environment Variables

This project uses environment variables to configure various settings. The required files are `.env` and `.env.test`. The `.env` file should be copied from `.env.example` and filled with the appropriate values.

#### 3.1. .env file

- Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

- Edit `.env` with the correct values for your local environment (The .env.example file should be sufficient for testing.).

#### 3.2. .env.test file

If you're working on tests, you'll need to configure `.env.test` as well. Copy the example file:

```bash
cp .env.test.example .env.test
```

Ensure all required test-specific variables are filled out in `.env.test`. (The .env.test.example file should be sufficient for testing.)

### 4. HTTP/2 Configuration

This project supports **HTTP/2** through **Fastify**. Make sure you have the **TLS certificate** and **private key** for your local environment.

1. Place your **certificate** and **private key** files in the `config/certs/` folder.
2. Ensure that the following paths are correct in the configuration files:
   - `config/certs/tls.crt`
   - `config/certs/tls.key`

### 5. Docker Setup

This project uses Docker Compose to set up the development environment. Follow these steps to configure and run Docker containers:

1. **Build the Docker images**:

```bash
docker-compose build
```

2. **Start the containers**:

```bash
docker-compose up 
```

This command will start all the services defined in the `docker-compose.yml` file, including the NestJS application with Fastify.

3. **Stop the containers**:

```bash
docker-compose down
```

### 6. Running Tests

To run tests using the environment configuration specified in `.env.test`, use:

```bash
npm run test:e2e
```
