# Neko Music Web Application

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mrcatlait_neko-music-web&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mrcatlait_neko-music-web)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=mrcatlait_neko-music-web&metric=coverage)](https://sonarcloud.io/summary/new_code?id=mrcatlait_neko-music-web)

This repository contains the web application component of the Neko Music project, providing the user interface for our music streaming service. Built with Angular and styled using a custom design based on Material 3 guidelines, it offers a sleek and responsive experience for music lovers.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Code Quality](#code-quality)

## Features

- Intuitive music player interface
- Playlist management
- User profile customization
- Advanced search and discovery tools
- Responsive design for various devices

## Technologies

- **Framework**: Angular
- **UI Design**: Custom components based on Material 3 guidelines
- **State Management**: Angular services with signals
- **Testing**: 
  - Unit Tests: Vitest
  - Integration Tests: Cypress
  - Contract Tests: PactJS
- **Code Quality**: ESLint, Prettier, Stylelint

## Project Structure

The project is structured using Angular's modular architecture to ensure scalability and maintainability. It is divided into three main module types:

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
   - This folder contains page components that act as wrappers for routing. These components combine multiple features and display them in a structured way, allowing for seamless navigation and organization of the application's content.

### General Project Structure

```plaintext
web/
├── src/
│   ├── app/
│   │   ├── core/                # Core module with singleton services and components
│   │   ├── shared/              # Shared module with reusable components, directives, and pipes
│   │   ├── features/            # Folder containing feature modules
│   │   ├── layout/              # Global layout components applied to the application
│   │   ├── pages/               # Page components used for routing and combining features
│   │   └── app.module.ts        # Root module
│   ├── assets/                  # Static assets (images, fonts)
│   └── environments/            # Environment-specific configuration
└─  package.json
```

### Example Feature Module Structure

Each feature module has its own dedicated folder that may include various components, services, state management, pipes, and routing. The structure for a single feature module might look like this:

```plaintext
features/
├── feature-name/                # Feature module folder
│   ├── components/              # Components specific to this feature
│   ├── services/                # Feature-specific services
│   ├── state/                   # State management
│   ├── pipes/                   # Feature-specific pipes
│   └── feature.module.ts        # Module definition for the feature
```

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (>= 14.x)
- npm (>= 6.x) or yarn
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
   moon web:start
   ```

The application should now be running at `http://localhost:4200`.

## Available Scripts

- **Start development server**:
  ```bash
  moon web:start
  ```
- **Build for production**:
  ```bash
  moon web:build
  ```
- **Run linter**:
  ```bash
  moon web:lint
  ```

## Testing

- **Unit Tests**:
  ```bash
  moon web:test-unit
  ```
- **Integration Tests**:
  ```bash
  moon web:test-integration
  ```
- **Contract Tests**:
  ```bash
  moon web:test-contract
  ```
- **Run all tests**:
  ```bash
  moon web:test
  ```

## Code Quality

We maintain high code quality standards using:
- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting
- Stylelint for CSS/SCSS linting

To format code and fix linting issues:
```bash
moon web:lint
```

For more detailed information about the entire Neko Music project, please refer to the [main README](../../README.md).
