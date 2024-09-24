# Web Application (Music Streaming Interface)

This repository contains the **web application** component of the monorepo project, which provides the user interface for a music streaming service. This Angular-based app is styled using a custom design that follows Material 3 guidelines.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Testing](#testing)
- [Code Formatting](#code-formatting)
- [Moonrepo](#moonrepo)
- [License](#license)

## Prerequisites

Before setting up the project, ensure that you have the following installed:

1. **Node.js** (>= 14.x) and **npm** (>= 6.x) or **yarn**.
   - You can download Node.js from [here](https://nodejs.org/).

2. **Moonrepo** for monorepo task orchestration and management. Follow these steps to install Moonrepo globally:
   ```
   npm install -g moonrepo
   ```

   For more information on Moonrepo installation and usage, refer to the official [Moonrepo Documentation](https://moonrepo.dev/docs).

## Installation

To set up the web application locally:

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   ```

2. **Run the development server**:
   ```bash
   moon web:start
   ```

Moonrepo will install all required dependencies automatically on the first run. The application should now be running at `http://localhost:4200`.

## Project Structure

The project is structured using Angular’s modular architecture to ensure scalability and maintainability. It is divided into three main module types:

1. **Core Module**:
   - The core module contains singleton services, and repositories that are used across the entire application. These include things like authentication, routing, and configuration services.
   - The core module is generally imported once in the root module (`AppModule`) and should not be imported into any feature or shared module.

2. **Shared Module**:
   - The shared module contains reusable components, directives, and pipes that can be used across different feature modules.
   - The shared module can be imported into any feature or other modules that need access to these reusable components.

3. **Feature Modules**:
   - Feature modules are dedicated to specific features or sections of the application. Each feature module encapsulates its own components, services, and state.

4. **Layout**
   - This folder contains components and templates that define the global layout of the application. It typically includes headers, footers, side navigation, and other structural elements that provide a consistent look and feel across all pages.

5. **Pages**
   - This folder contains page components that act as wrappers for routing. These components combine multiple features and display them in a structured way, allowing for seamless navigation and organization of the application’s content.

### General Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── core/                # Core module with singleton services and components
│   │   ├── shared/              # Shared module with reusable components, directives, and pipes
│   │   ├── features/            # Folder containing feature modules
│   │   ├── layout/              # Global layout components applied to the application
│   │   ├── pages/               # Page components used for routing and combining features
│   │   └── app.module.ts        # Root module
```

### Example Feature Module Structure

Each feature module has its own dedicated folder that may include various components, services, state management, pipes, and routing. The structure for a single feature module might look like this:

```
features/
├── feature-name/                # Feature module folder
│   ├── components/              # Components specific to this feature
│   ├── services/                # Feature-specific services
│   ├── state/                   # State management
│   ├── pipes/                   # Feature-specific pipes
│   └── feature.module.ts        # Module definition for the feature
```

## Scripts

Here are the commonly used scripts for this web application, executed via Moonrepo:

- **Start the development server**:
  ```bash
  moon web:start
  ```
- **Build the application for production**:
  ```bash
  moon web:build
  ```
- **Lint the codebase**:
  ```bash
  moon web:lint
  ```

## Testing

The web application includes various types of tests to ensure the code is reliable and performs as expected. All tests are executed using Moonrepo.

- **Unit Tests**: Written using [Vitest](https://vitest.dev/), run the tests with:
  ```bash
  moon wen:test-unit
  ```

- **Contract Tests**: Built using [PactJS](https://pact.io/) and executed with [Vitest](https://vitest.dev/). Run the contract tests with:
  ```bash
  moon web:test-contract
  ```

- **Integration Tests**: Handled using [Cypress](https://www.cypress.io/) for end-to-end testing. To run the integration tests:
  ```bash
  moon web:test-integration
  ```

- **All Tests**: To run all tests:
  ```bash
  moon web:test
  ```

## Code Formatting

The project uses a strict set of formatting and linting tools to ensure consistent code style across the codebase. The following tools are used:

- **ESLint**: For JavaScript/TypeScript linting.
- **Prettier**: For code formatting.
- **Stylelint**: For linting CSS/SCSS styles.

To automatically format the code and fix linting issues:

```bash
moon web:lint
```

## Moonrepo

This web application is managed as part of a monorepo using [Moonrepo](https://moonrepo.dev/), which provides task orchestration and monorepo management.

- **Build orchestration**: Moonrepo handles the build process, ensuring consistency across multiple apps and packages in the repository.
- **Task caching**: By leveraging task caching, the project achieves faster build and test times.

Refer to the Moonrepo [documentation](https://moonrepo.dev/docs) for more details on setting up and managing monorepo-based projects.

## License

This project is licensed under the [MIT License](../../LICENSE).
