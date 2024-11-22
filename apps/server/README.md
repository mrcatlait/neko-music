# Neko Music Server Application

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mrcatlait_neko-music-server&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mrcatlait_neko-music-server)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=mrcatlait_neko-music-server&metric=coverage)](https://sonarcloud.io/summary/new_code?id=mrcatlait_neko-music-server)

This repository contains the server application component of the Neko Music project, providing the backend API for our music streaming service. Built with Elysia and running on the Bun runtime, it offers high-performance music streaming capabilities with MPEG DASH support.

## Technologies

- **Framework**: Elysia (Bun runtime)
- **Database**: PostgreSQL with raw SQL queries
- **Testing**: 
  - Unit Tests: Vitest
  - Integration Tests: Vitest + Testcontainers
  - Contract Tests: PactJS
- **Code Quality**: ESLint, Prettier
- **Streaming**: MPEG DASH

## Project Structure

The project follows a domain-driven design approach with a modular architecture to ensure scalability and maintainability. It is organized into several key directories:

1. **Core Module**:
   - Contains essential services and utilities used across the application
   - Includes configuration, cryptography, and base container implementations
   - Houses core validation logic and shared models

2. **Common Module**:
   - Provides shared utilities, DTOs, and constants
   - Contains common exceptions and plugins
   - Implements database connection and configuration services

3. **Features**:
   - Each feature is a self-contained module with its own controllers, services, and repositories
   - Follows command-query separation (CQS) pattern
   - Implements domain-specific business logic

### General Project Structure

```plaintext
server/
├── src/
│   ├── core/                 # Core module with essential services
│   │   ├── base/             # Base implementations
│   │   ├── models/           # Core domain models
│   │   ├── services/         # Core services
│   │   └── validation/       # Validation logic
│   ├── common/               # Shared utilities and services
│   │   ├── constants/        # Application constants
│   │   ├── dto/              # Data transfer objects
│   │   ├── exceptions/       # Custom exceptions
│   │   ├── plugins/          # Elysia plugins
│   │   └── services/         # Common services
│   ├── features/             # Feature modules
│   │   ├── authentication/   # Authentication feature
│   │   ├── authorization/    # Authorization feature
│   │   ├── playlist/         # Playlist management
│   │   ├── track/            # Track management and streaming
│   │   └── user/             # User management
│   ├── migrations/           # Database migrations
│   └── seeds/                # Database seed data
└── package.json
```

### Example Feature Module Structure

Each feature module follows a consistent structure:

```plaintext
features/feature-name/
├── commands/           # Command handlers
├── controllers/        # HTTP controllers
├── models/            # Domain models
├── repositories/      # Data access layer
├── services/          # Business logic
└── index.ts          # Public API
```

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Bun runtime (>= 1.0.0)
- PostgreSQL (>= 16.0)
- Docker (for running integration tests)
- Moonrepo (global installation)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mrcatlait/neko-music.git
   ```

2. Navigate to the project directory:
   ```bash
   cd neko-music
   ```

3. Start the development server:
   ```bash
   moon server:start
   ```

The server should now be running at `http://localhost:3000`.

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
- ESLint for TypeScript linting
- Prettier for code formatting
- SonarQube for code quality analysis

To format code and fix linting issues:
```bash
moon server:lint
```

## Docker Support

The application includes Docker support for development and testing:

```bash
docker-compose up -d
```

This will start a PostgreSQL instance with the configuration specified in the environment variables.

## Environment Variables

The application requires the following environment variables:

```plaintext
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=neko_music

# Application
UI_URL=http://localhost:4200
```

For more detailed information about the entire Neko Music project, please refer to the [main README](../../README.md).