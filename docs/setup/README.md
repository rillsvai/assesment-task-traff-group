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

#### 4.1. Create Folders and Generate TLS Certificate and Private Key with ECC

To generate a self-signed **TLS certificate** and **private key** using the **Elliptic Curve Cryptography (ECC)** algorithm, follow these steps:

1. **Create the necessary folder structure**:

```bash
mkdir -p config/certs
```

2. **Generate the private key** (`tls.key`) using the `secp384r1` elliptic curve:

```bash
openssl ecparam -name secp384r1 -genkey -noout -out config/certs/tls.key
```

3. **Generate the self-signed certificate** (`tls.crt`) using the private key:

```bash
openssl req -new -x509 -key config/certs/tls.key -out config/certs/tls.crt -days 365
```

This will create the `tls.crt` and `tls.key` files in the `config/certs/` folder, which will be used for the HTTP/2 configuration.


### 5. Docker Setup

This project uses Docker Compose to set up the development environment. Follow these steps to configure and run Docker containers:

1. **Build the Docker images**:

```bash
docker compose build
```

2. **Start the containers**:

```bash
docker compose up -d
```
then
```bash
docker compose logs -f api
```

This command will start all the services defined in the `docker compose.yaml` file, including the NestJS application with Fastify.

3. **Stop the containers**:

```bash
docker compose down
```

### 6. Running Tests

To run tests using the environment configuration specified in `.env.test`, use:

```bash
npm run test:e2e
```
