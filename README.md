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
- **Framework**: Elysia (Bun runtime)
- **Database**: PostgreSQL with raw SQL
- **Testing**: Vitest (unit & integration), PactJS (contract)
- **Code Quality**: ESLint, Prettier

### Moonrepo
- Build orchestration and task caching for faster development

## Project Structure

```plaintext
/neko-music
├── /apps
│   ├── /web                  # Angular-based web application
│   └── /server               # Elysia-based backend application
├── /contracts                # Pact contracts for API communication testing
└── /packages                 # Shared libraries and configurations
    ├── /eslint-config       # Shared ESLint configuration
    ├── /stylelint-config    # Shared Stylelint configuration
    ├── /vitest              # Shared Vitest configuration
    ├── /permissions         # Shared permissions library
    └── /web-test-utils      # Shared testing utilities
```

For more detailed information about specific components:
- [Web Application README](apps/web/README.md)
- [Server Application README](apps/server/README.md)

## Getting Started

To get started, you'll need **Moonrepo** installed globally. Moonrepo will automatically install all required dependencies.

### Prerequisites

Before setting up the project, you'll need **Moonrepo** installed. You have several options to install it:

Using proto (recommended):
```bash
proto plugin add moon "https://raw.githubusercontent.com/moonrepo/moon/master/proto-plugin.toml" --to global
proto install moon
```

Using npm:
```bash
npm install --save-dev @moonrepo/cli
```

On Linux, macOS, or WSL:
```bash
curl -fsSL https://moonrepo.dev/install/moon.sh | bash
```

Then add to your PATH:
```bash
export PATH="$HOME/.moon/bin:$PATH"
```

On Windows (PowerShell):
```powershell
irm https://moonrepo.dev/install/moon.ps1 | iex
```

For more detailed information about Moonrepo installation and usage, refer to the official [Moonrepo Documentation](https://moonrepo.dev/docs/install).


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

### Phase 1: Foundation and Core Functionality ✓
- [x] Set up project structure (Angular frontend, Elysia backend)
- [x] Implement basic user authentication
- [x] Create basic music player with standard controls
- [x] Implement basic playlist management
- [x] Set up CI/CD pipeline

### Phase 2: Core Music Features
- [x] Implement MPEG DASH streaming
- [ ] Add support for various audio formats
- [ ] Implement basic audio controls (equalizer, volume normalization)
- [ ] Add queue management and shuffle play
- [ ] Implement continuous playback

### Phase 3: Library Management
- [ ] Enhanced search functionality
- [ ] Advanced playlist management
- [ ] Basic metadata management
- [ ] Recently played tracks
- [ ] Favorite tracks system

### Phase 4: User Experience
- [x] Responsive web design
- [ ] Create Progressive Web App (PWA)
- [ ] Implement offline mode for saved tracks
- [ ] Add keyboard shortcuts
- [ ] Implement drag-and-drop playlist management

### Phase 5: Social Features
- [ ] Basic user profiles
- [ ] Playlist sharing
- [ ] Follow/unfollow users
- [ ] Activity feed for followed users
- [ ] Social playlist collaboration

### Phase 6: Cross-Platform Support
- [x] Develop responsive web design for mobile browsers
- [ ] Create Progressive Web App (PWA) version

### Phase 6: Advanced Features
- [ ] Smart playlists based on listening history
- [ ] Basic recommendation system
- [ ] Last.fm integration
- [ ] Lyrics display
- [ ] Basic audio visualization

### Ongoing
- [ ] Security improvements
- [ ] Performance optimizations
- [ ] Accessibility enhancements
- [ ] Documentation updates
