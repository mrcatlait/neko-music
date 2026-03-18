# Contribution Guidelines

Thank you for your interest in contributing to Neko Music!

## Table of Contents

- [Getting Started](#getting-started)
- [Setting Up the Dev Environment](#setting-up-the-dev-environment)
- [Development Workflow](#development-workflow)
- [Contribution Guidelines](#contribution-guidelines)
- [Good First Contributions](#good-first-contributions)
- [Commit Message Format](#commit-message-format)
- [Pull Requests](#pull-requests)
- [Help & Support](#help--support)

## Getting Started

### Creating a Fork

Create a fork of the repository via the fork button on GitHub. This creates your own copy under your account.

### Cloning Locally

```bash
# Clone your fork and enter the project directory
git clone https://github.com/YOUR-USERNAME/neko-music.git
cd neko-music
```

Add the upstream remote to pull updates from the original repository:

```bash
# Add the original repo as upstream to fetch and merge updates
git remote add upstream https://github.com/mrcatlait/neko-music.git
```

### Staying Up to Date

Keep your fork synchronized with upstream. See [GitHub's guide on syncing forks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork).

Using Git:

```bash
# Fetch latest changes from upstream
git fetch upstream
# Switch to main branch
git checkout main
# Merge upstream changes into your local main
git merge upstream/main
# Push updated main to your fork
git push origin main
```

## Setting Up the Dev Environment

### Prerequisites

- **Moonrepo** — install via [proto](https://moonrepo.dev/docs/install) (recommended), npm, or the install script

Moonrepo manages Node.js and dependencies automatically.

### 1. Start the Database

PostgreSQL is required before running the server:

```bash
# Start PostgreSQL via Docker Compose (required for the server)
moon run database:start
```

### 2. Run the Applications

```bash
# Start the Angular dev server (Vite)
moon run web:start
# Start the NestJS API with watch mode
moon run server:start
```

Run both in separate terminals to develop full-stack.

## Development Workflow

### Building

```bash
# Production build of the Angular app
moon run web:build
# Compile the NestJS server to dist/
moon run server:build
```

### Testing

Run tests before submitting a pull request.

**Server:**

```bash
# Unit tests (Vitest)
moon run server:test-unit
# Integration tests (Testcontainers)
moon run server:test-integration
# Pact provider verification
moon run server:test-contract
```

**Web:**

```bash
# Unit tests (Vitest + vitest-angular)
moon run web:test-unit
# Pact consumer contract generation
moon run web:test-contract
# Cypress E2E tests
moon run web:test-integration
```

### Linting

```bash
# Lint the Angular app (ESLint, Prettier, Stylelint)
moon run web:lint
# Lint the NestJS server (ESLint, Prettier)
moon run server:lint
```

## Contribution Guidelines

### Bug Fixes

Create an issue first describing the bug and your intended fix. When ready, open a pull request with your changes.

### New Features

For larger features, open a feature request issue to discuss the design before implementing. This helps avoid duplicate work and ensures the approach fits the project.

### Code Standards

- Follow the project's ESLint and Prettier configuration
- Add unit tests for new or changed behavior
- Update Pact contracts if you change API interfaces
- Update documentation when adding or changing public APIs

## Good First Contributions

These are scoped tasks that help you learn the codebase without diving into complex features.

### Documentation

- Fix typos or clarify wording in the README, CONTRIBUTING, or app-specific docs
- Add JSDoc comments to public APIs that lack them
- Improve error messages or validation feedback to be more helpful

### Tests

- Add unit tests for utilities, pipes, or services that lack coverage
- Add edge-case tests to existing specs (null inputs, empty arrays, boundary values)
- Run `moon run web:test-unit` and `moon run server:test-unit` to find gaps

### Small Refactors

- Rename classes or functions for consistency (e.g. `AddGenreUseCase` → `CreateGenreUseCase` if the pattern elsewhere uses "Create")
- Extract repeated logic into shared utilities
- Add missing types or tighten existing ones

### Validation and Error Handling

- Add validation for optional request fields (e.g. artist IDs in album creation)
- Handle specific error codes (e.g. 401) in API clients to improve UX
- Improve rollback or cleanup in services that have `@todo` comments

### Improve UI/UX

- Improve accessibility (ARIA labels, keyboard navigation, focus states)
- Refine responsive layout or fix layout issues on smaller screens
- Improve loading states, empty states, or error feedback in the catalog or backstage
- Polish interactions (transitions, hover states, visual hierarchy)

### Shared Packages

- Add DOM selectors to `@neko/selectors` when you find selectors duplicated between contract tests and E2E tests
- Add permission constants to `@neko/permissions` when adding new guarded actions

### Before You Start

- Search existing issues to avoid duplicate work
- For refactors or validation changes, open an issue first to confirm the approach
- Start with documentation or tests if you are new to the codebase

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org):

```
type(scope): Short description in present tense
```

**Types:** `feat`, `fix`, `docs`, `perf`, `style`, `refactor`, `test`, `chore`

**Scopes:** `web`, `server`, `contracts`, `permissions`, `selectors`, or the affected package name.

Examples:

```
feat(server): add artist sync use case
fix(web): correct playback state on track end
docs(readme): update setup instructions
```

## Pull Requests

1. Create a branch from `main`: `git checkout -b your-branch-name` (creates and switches to a new branch)
2. Make your changes and run the relevant tests
3. Rebase against the latest `main` before opening the PR
4. Fill out the [pull request template](.github/pull_request_template.md)
5. Reference any related issues in the PR description

## Help & Support

- **Documentation:** See the [README](README.md) and app-specific READMEs in `apps/web` and `apps/server`
- **Issues:** Use the [bug report](.github/ISSUE_TEMPLATE/bug_report.md) or [feature request](.github/ISSUE_TEMPLATE/feature_request.md) templates when opening issues
