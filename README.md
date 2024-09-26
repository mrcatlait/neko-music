# Neko Music

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mrcatlait/neko-music/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Neko Music is a full-featured music streaming platform designed to offer a smooth experience for discovering, playing, and curating music. This monorepo hosts two main applications: a sleek Angular web interface and a powerful NestJS backend, both managed with Moonrepo for streamlined development and orchestration.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running the Applications](#running-the-applications)
- [License](#license)

## Features

- Seamless music streaming
- Advanced search and discovery
- Playlist creation and management
- User profiles and social sharing
- Responsive design for all devices

## Technologies

### Web Application (Frontend)
- **Framework**: Angular 
- **Design**: Custom UI based on Material 3 guidelines
- **Testing**: Vitest (unit), Cypress (E2E), PactJS (contract)
- **Code Quality**: ESLint, Prettier, Stylelint

### Server Application (Backend)
- **Framework**: NestJS (modular monolith architecture)
- **Database**: TypeORM with PostgreSQL
- **Testing**: Vitest (unit & integration), PactJS (contract)
- **Code Quality**: ESLint, Prettier

### Moonrepo
- Build orchestration and task caching for faster development

## Project Structure

```plaintext
/neko-music
├── /apps
│   ├── /web                  # Angular-based web application
│   └── /server               # NestJS-based backend application
├── /contracts                # Pact contracts for API communication testing
└── /packages                 # Shared libraries and configurations
```

For more detailed information about specific components:
- [Web Application README](apps/web/README.md)
- [Server Application README](apps/server/README.md)

## Getting Started

To get started, you'll need **Moonrepo** installed globally. Moonrepo will automatically install all required dependencies.

### Prerequisites

Before setting up the project, ensure that you have the following installed:

1. **Node.js** (>= 14.x) and **npm** (>= 6.x) or **yarn**.
   - You can download Node.js from [here](https://nodejs.org/).

2. **Moonrepo** for monorepo task orchestration and management. Follow these steps to install Moonrepo globally:
   ```
   npm install -g moonrepo
   ```

   For more information on Moonrepo installation and usage, refer to the official [Moonrepo Documentation](https://moonrepo.dev/docs).


### Running the Applications

Once **Moonrepo** is installed, you can easily manage the frontend and backend applications using the following commands:

- **Web Application**:
   ```bash
   moon web:start       # Starts the web application locally
   moon web:test        # Runs unit and integration tests
   moon web:build       # Builds the web application for production
   ```

- **Server Application**:
   ```bash
   moon server:start    # Starts the server locally
   moon server:test     # Runs unit, integration, and contract tests
   moon server:build    # Builds the server for production
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
