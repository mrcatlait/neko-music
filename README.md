# Neko Music

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mrcatlait/neko-music/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Neko Music is a full-featured music streaming platform designed to offer a smooth experience for discovering, playing, and curating music. This monorepo hosts two main applications: a sleek Angular web interface and a powerful NestJS backend, both managed with Moonrepo for streamlined development and orchestration.



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

## Roadmap

### Phase 1: Foundation and Core Functionality
- [x] Set up project structure (Angular frontend, NestJS backend)
- [ ] Implement basic user authentication (local auth)
- [x] Develop music file upload and storage system
- [x] Create basic music player with standard controls
- [ ] Implement basic playlist management
- [x] Set up CI/CD pipeline for automated testing and deployment

### Phase 2: Advanced Streaming and Audio Features
- [x] Implement MPEG DASH streaming
- [ ] Develop adaptive bitrate streaming
- [x] Add support for various audio formats (FLAC, AAC, OGG, etc.)
- [ ] Implement gapless playback
- [ ] Develop audio normalization feature
- [ ] Create visualizer for audio playback

### Phase 3: Library Management and Discovery
- [ ] Implement advanced search and filtering options
- [ ] Develop automatic metadata fetching and management
- [ ] Create smart playlists based on listening habits
- [ ] Implement music recommendation system
- [ ] Add support for lyrics display and synchronization
- [ ] Develop a "Discover" section for new music exploration

### Phase 4: Social Features and Sharing
- [ ] Implement user profiles
- [ ] Develop friend system and social connections
- [ ] Create shared playlists functionality
- [ ] Implement activity feed for friends' listening habits
- [ ] Add option to share songs/playlists via unique links
- [ ] Develop collaborative playlists feature

### Phase 5: Customization and Extensibility
- [ ] Create plugin system for easy feature extensions
- [ ] Implement theming engine for UI customization
- [ ] Develop API for third-party integrations
- [ ] Add support for custom audio sources (local files, cloud storage)
- [ ] Implement user-defined smart radio stations
- [ ] Create a marketplace for community-created plugins and themes

### Phase 6: Cross-Platform Support
- [x] Develop responsive web design for mobile browsers
- [ ] Create Progressive Web App (PWA) version
- [ ] Develop native mobile apps (iOS and Android)
- [ ] Implement desktop apps using Electron
- [ ] Add support for smart speakers and home assistants
- [ ] Develop TV apps for popular platforms (Apple TV, Android TV, etc.)

### Phase 7: Advanced Features and Optimizations
- [ ] Implement offline mode with smart caching
- [ ] Develop advanced audio processing features (equalizer, effects)
- [ ] Create DJ mode with mixing capabilities
- [ ] Implement multi-room audio synchronization
- [ ] Develop voice control for hands-free operation
- [ ] Optimize for low-latency live streaming

### Phase 8: Integration and Ecosystem
- [ ] Develop import/export tools for other music services
- [ ] Implement scrobbling to Last.fm and similar services
- [ ] Create integrations with popular music production tools
- [ ] Develop podcast support and management
- [ ] Implement integration with smart home systems
- [ ] Create a companion app for wearables (smartwatches)

### Phase 9: Scalability and Enterprise Features
- [ ] Implement multi-tenancy for hosting multiple libraries
- [ ] Develop advanced analytics and reporting tools
- [ ] Create admin dashboard for system management
- [ ] Implement role-based access control (RBAC)
- [ ] Develop white-label solution for businesses
- [ ] Create documentation for enterprise deployment

### Phase 10: Community and Monetization (Optional)
- [ ] Develop a community forum for user discussions
- [ ] Implement a donation system for supporting the project
- [ ] Create a premium tier with advanced features
- [ ] Develop marketplace for artists to sell music directly
- [ ] Implement ad integration for free tier (optional)
- [ ] Create developer program for third-party contributions

### Ongoing: Security, Performance, and Compliance
- [x] Regularly update dependencies and address security vulnerabilities
- [x] Conduct periodic security audits and penetration testing
- [ ] Optimize database queries and caching strategies
- [ ] Conduct accessibility audits and improvements (WCAG compliance)
- [ ] Regularly review and optimize cloud resource usage
