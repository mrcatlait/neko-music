# Neko Music

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mrcatlait/neko-music/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Neko Music is a self-hosted, web-first music streaming platform. You own your files, your data, and your listening history. No external catalog dependencies, no tracking, no lock-in.

This monorepo hosts the Angular web application, the NestJS backend, shared packages, infrastructure configuration, and all test suites — managed with Moonrepo for task orchestration and caching.

## Technologies

### Web Application (Frontend)
- **Framework**: Angular 21 (standalone components, Signals, OnPush change detection)
- **Audio**: MPEG-DASH adaptive streaming via `dash.js`
- **Testing**: Vitest (unit), Cypress (E2E), Pact (consumer contract)
- **Code Quality**: ESLint, Prettier, Stylelint

### Server Application (Backend)
- **Framework**: NestJS 11 on Fastify
- **Database**: PostgreSQL with Kysely (type-safe SQL query builder)
- **Media**: ffmpeg for MPEG-DASH transcoding, sharp for image processing
- **Testing**: Vitest (unit & integration via Testcontainers), Pact (provider contract), k6 (performance)
- **Code Quality**: ESLint, Prettier

### Shared Packages
- **`@neko/contracts`** — TypeScript DTOs shared between frontend and backend
- **`@neko/permissions`** — RBAC roles and permissions used by both the UI and API guards
- **`@neko/selectors`** — DOM selector strings shared between contract tests and acceptance tests

### Infrastructure
- **Moonrepo** — Task orchestration, build caching, and dependency graph
- **Docker Compose** — PostgreSQL database and Grafana + OpenTelemetry monitoring stack
- **Terraform** — Cloudflare Pages deployment (`infra/cf-pages/`)

## Project Structure

```plaintext
/neko-music
├── /apps
│   ├── /web                  # Angular SPA (catalog + backstage admin)
│   └── /server               # NestJS REST API
├── /packages                 # Shared libraries
│   ├── /contracts            # API DTOs (auth, backstage, media, error)
│   ├── /permissions          # RBAC roles and permission constants
│   └── /selectors            # Shared DOM selectors for testing
├── /tools
│   ├── /eslint-config        # Shared ESLint + Prettier configuration
│   └── /stylelint-config     # Shared Stylelint configuration
├── /acceptance-tests         # Full-stack acceptance test suite
├── /infra
│   ├── /database             # Docker Compose for PostgreSQL
│   ├── /monitoring           # Docker Compose for Grafana + OpenTelemetry
│   └── /cf-pages             # Terraform for Cloudflare Pages deployment
└── /contracts                # Generated Pact contract JSON files
```

For more detailed information about specific applications:
- [Web Application README](apps/web/README.md)
- [Server Application README](apps/server/README.md)

## Getting Started

### Prerequisites

**Node.js ~22** and **Moonrepo** are required. Moonrepo handles all other dependency installation automatically.

Install Moonrepo:

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
export PATH="$HOME/.moon/bin:$PATH"
```

On Windows (PowerShell):
```powershell
irm https://moonrepo.dev/install/moon.ps1 | iex
```

For more details, see the [Moonrepo Documentation](https://moonrepo.dev/docs/install).

### Starting the Infrastructure

Start the PostgreSQL database (required before running the server):
```bash
moon run database:start
```

Optionally start the monitoring stack (Grafana + OpenTelemetry):
```bash
moon run monitoring:start
```

### Running the Applications

```bash
moon run web:start       # Angular dev server
moon run server:start    # NestJS with watch mode
```

### Building

```bash
moon run web:build       # Production build
moon run server:build    # Compile to dist/
```

### Testing

**Server:**
```bash
moon run server:test-unit           # Unit tests
moon run server:test-integration    # Integration tests (Testcontainers)
moon run server:test-contract       # Pact provider verification
moon run server:test-performance    # k6 performance tests
```

**Web:**
```bash
moon run web:test-unit              # Unit tests (Vitest + vitest-angular)
moon run web:test-contract          # Pact consumer contract generation
moon run web:test-integration       # Cypress E2E tests
```

**Full stack:**
```bash
moon run acceptance-tests:test      # Acceptance test suite
```

### Linting

```bash
moon run web:lint
moon run server:lint
```

## Architecture Notes

**MPEG-DASH for all audio**: Uploaded audio is transcoded by ffmpeg into multi-bitrate AAC segments (128k + 256k) stored as DASH manifests. The frontend streams adaptively via dash.js — no raw file serving.

**Consumer-driven contract testing**: The web app generates Pact consumer contracts. The server runs provider verification against those contracts in CI, machine-verifying API compatibility.

**Use-case pattern (server)**: Every business operation is a single-method use case class (`.invoke()`). Controllers are thin orchestrators. Swapping infrastructure (e.g. S3, different transcoder) requires only a new strategy implementation.

**Shared permissions**: `@neko/permissions` defines the same role-to-permission mapping used by Angular feature flags and NestJS guards, keeping UI gating and API enforcement in sync.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
