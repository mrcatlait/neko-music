# Neko Music Server Application

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mrcatlait_neko-music-server&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mrcatlait_neko-music-server)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=mrcatlait_neko-music-server&metric=coverage)](https://sonarcloud.io/summary/new_code?id=mrcatlait_neko-music-server)

This repository contains the server application component of the Neko Music project, providing the backend services for our music streaming platform. Built with NestJS and following a modular monolith architecture, it offers a scalable and maintainable solution for handling music streaming, user management, and more.

## Technologies

- **Framework**: NestJS
- **Database**: TypeORM with PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: 
  - Unit & Integration Tests: Vitest
  - Contract Tests: PactJS
- **Code Quality**: ESLint, Prettier

## Project Structure

The project follows a modular monolith architecture, which allows for clear separation of concerns and easy scalability. It is organized into the following main components:

1. **Feature Modules**:
   - Each major feature (e.g., auth, users, music, playlists) is encapsulated in its own module.
   - Modules contain controllers, services, and database entities related to their specific domain.
   - Feature modules are independent and can be easily maintained or extended.

2. **Core Module**:
   - Contains application-wide services, guards, and interceptors.
   - Handles cross-cutting concerns like logging, error handling, and configuration.
   - The core module is imported once in the root module and provides functionality used across all feature modules.

3. **Migrations**:
   - Contains database migration files for managing schema changes over time.
   - Helps in version controlling the database schema and applying changes systematically.

### General Project Structure

```plaintext
server/
├── src/
│   ├── features/              # Feature modules
│   ├── core/                  # Core module with application-wide concerns
│   └── main.ts                # Application entry point
├── migrations/                # Database migration files
└── package.json
```

### Example Feature Module Structure

Each feature module typically includes the following components:

```plaintext
features/
├── feature-name/
│   ├── controllers/           # Handle HTTP requests and define API endpoints
│   ├── services/              # Contain business logic and data manipulation
│   ├── entities/              # Define database models and relationships
│   ├── dto/                   # Data Transfer Objects for request/response shaping
│   ├── interfaces/            # TypeScript interfaces for type definitions
│   └── feature-name.module.ts # Module definition and dependency configuration
```

### Core Module Structure

The core module contains application-wide concerns:

```plaintext
core/
├── guards/                    # Authentication and authorization guards
├── interceptors/              # Request/response interceptors
├── services/                  # Shared services (e.g., logging, caching)
├── interfaces/                # Shared interfaces and types
└── core.module.ts             # Core module definition
```

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (>= 14.x)
- npm (>= 6.x) or yarn
- Moonrepo (global installation)
- Docker and Docker Compose

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mrcatlait/neko-music.git
   ```

2. Navigate to the project directory:
   ```bash
   cd neko-music
   ```

3. Start the PostgreSQL database using Docker Compose:
   ```bash
   cd apps/server
   docker-compose up -d
   ```

   This command will start a PostgreSQL instance locally for development purposes.

4. Return to the root directory and start the development server:
   ```bash
   cd ../..
   moon server:start
   ```

The server should now be running at `http://localhost:3000` with a connection to the local PostgreSQL database.

### Environment Setup

Docker Compose automatically reads environment variables from a `.env` file in the same directory as the `docker-compose.yml` file. Create a `.env` file in the `apps/server` directory with the following content:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=database_name
```

Replace `username`, `password`, and `database_name` with the values specified in your `docker-compose.yml` file.

## Available Scripts

- **Start development server**:
  ```bash
  moon server:start
  ```
- **Build for production**:
  ```bash
  moon server:build
  ```
- **Run linter**:
  ```bash
  moon server:lint
  ```

## Testing

- **Unit Tests**:
  ```bash
  moon server:test-unit
  ```
- **Integration Tests**:
  ```bash
  moon server:test-integration
  ```
- **Contract Tests**:
  ```bash
  moon server:test-contract
  ```
- **Run all tests**:
  ```bash
  moon server:test
  ```

## Code Quality

We maintain high code quality standards using:
- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting

To format code and fix linting issues:
```bash
moon server:lint
```

For more detailed information about the entire Neko Music project, please refer to the [main README](../../README.md).