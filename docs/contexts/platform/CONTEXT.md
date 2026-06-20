# Platform

Neko Music is a self-hosted, extensible music streaming platform. One installation serves a small household or community — not a multi-tenant SaaS product.

## Language

**Household**:
The people sharing a single Neko Music installation — Curators and Listeners under one server, one library, one set of permissions.
_Avoid_: Tenant, organization, instance

**Curator**:
A user with permissions to manage content — Backstage editing, Import operations, or review/promotion. A household may have several curators with different permission sets.
_Avoid_: Admin (too generic), editor (ambiguous with import review)

**Permission tiers** (content):
- **Ingest tier** — import, edit Backstage drafts, resolve claims (`import.read`, `import.write`, `import.review`, Backstage write scopes)
- **Publish tier** — sync Backstage records to Catalog (`import.promote`); controls what Listeners hear
_Avoid_: Role names as domain terms (use Curator + tier instead)

**Listener**:
A user who consumes the published Catalog — browse, play, follow playlists. May have limited write permissions (e.g. personal playlists) but not Backstage access.
_Avoid_: Consumer (acceptable in prose, not as a domain term), end user

**Instance visibility**:
Whether the installation requires authentication to access anything. Neko Music defaults to **private** — no anonymous Catalog browsing.
_Avoid_: Public mode (use Registration mode for signup policy instead)

**Registration mode**:
How new accounts are created on a private instance. Configurable: `admin-only` (operator creates accounts), `invite` (registration requires a valid invite token — **default**), or `open` (anyone with the URL can register — opt-in, advanced).
_Avoid_: Sign-up policy, auth mode

**Invite**:
A token that allows one registration on an invite-gated instance. New invite registrants start as Listeners regardless of mode.
_Avoid_: Invitation link (too UI-specific)

**Default role on registration**:
Every new account starts as a **Listener**. Curator permissions (ingest tier, publish tier) are granted explicitly by an existing Curator — never automatic on signup.
_Avoid_: Default user role, signup role

**Self-hosted**:
The operator runs Neko Music on their own hardware. No external catalog dependency, no subscription to a central service. Data and files stay on their server.
_Avoid_: On-prem (enterprise connotation), local-only (implies no network access)

**Content entry**:
Music enters the system primarily through **Import** (external sources). Manual Backstage entry exists for corrections and edge cases, not bulk library building.
_Avoid_: Upload (one source type, not the whole model), ingestion pipeline (implementation)

**Extensibility** (v1 posture):
Strategy interfaces exist for storage, transcoding, import sources, and auth — but v1 ships one default implementation each. Swapping is for motivated operators, not a plugin marketplace or hot-loading system.
_Avoid_: Plugin (implementation), modular (too vague)

**Strategy**:
A swappable implementation behind a module boundary — e.g. `YoutubeImportStrategy`, `LocalStorageStrategy`. Registered in-process at startup; capabilities exposed to the web client at runtime.
_Avoid_: Plugin, provider, adapter (code terms)

## v1 scope

**Platform skeleton** (v1):
Prove the architecture end-to-end with minimal UX depth — auth, backstage, one import path, minimal catalog browse/play. Not a polished household product yet.
_Avoid_: MVP (implies feature-complete for users), beta

**Post-v1** (explicitly deferred):
Personal library features (playlists, favorites), invite registration UX, import workspace polish, soft dedupe, archive/retention policy. Direction is documented; implementation follows once the skeleton holds.
_Avoid_: Phase 2 (too vague without reference to skeleton)

**Skeleton import paths** (v1):
Two YouTube methods prove the architecture — **YouTube track** (single-item path) and **YouTube playlist** (multi-item discovery, selection, async job). Same strategy family; different scale. No other source types required for v1.
_Avoid_: YouTube-only (v1 is YouTube-only, but both granularities matter)

**Skeleton done**:
The platform skeleton is proven when `docker compose up` on a fresh machine lets an operator import via YouTube (track or playlist), publish to catalog, and a Listener play back — without manual dev-only setup steps.
_Avoid_: MVP complete, feature freeze

**Skeleton deployment**:
Docker Compose with minimal operator input — `.env` secrets (DB, JWT) and seeded administrator credentials from env. No setup wizard required for v1. Media and temp directories use sensible container defaults.
_Avoid_: One-click install (implies installer UX we don't have yet)

## Non-goals

Explicit boundaries — do not design toward these:

**Multi-tenant SaaS**:
One installation serves one household. No tenant isolation, billing, or operator-managed multi-library hosting.
_Avoid_: SaaS, cloud offering

**Licensed streaming catalog**:
No Spotify-style subscription catalog or external music licensing. Content comes from what the household imports or uploads.
_Avoid_: Streaming service, catalog provider

**Federation / cross-instance sharing**:
No ActivityPub, cross-server libraries, or social graph between Neko Music installations.
_Avoid_: Federated, decentralized (in the ActivityPub sense)

## Client surface (open)

**Web client**:
The primary UI is the Angular SPA. v1 skeleton is web-only.

**Native mobile apps**:
Not committed. Near-term exploration: whether a **PWA** (installable web, offline playback where feasible) is sufficient before any native app investment.
_Avoid_: Mobile app (until decided), cross-platform (too vague)

**PWA** (phased):
- **Skeleton**: installable web app — home screen, app shell, responsive layout; streaming requires network.
- **Mobile bar** (post-skeleton): background playback when screen locks or app is backgrounded — the usual breakpoint where pure web falls short on phones.
- **Offline listening**: explicitly deferred; large cache architecture, not v1.
_Avoid_: Progressive Web App (spell out requirements instead)

## Data ownership

**Backup** (skeleton):
Operator responsibility — back up PostgreSQL and the media storage directory. Neko Music documents expected paths; no in-app backup feature for v1.
_Avoid_: Disaster recovery (enterprise term)

**Export** (post-v1):
CLI or admin export of library metadata and asset manifest — supports portability without building full backup UI.
_Avoid_: Backup feature (that's ops UI, not export)

## Observability

**Skeleton**:
Monitoring stack (Grafana/OpenTelemetry in `infra/monitoring`) is optional — not required for skeleton-done. Structured application logs are sufficient for v1.
_Avoid_: Metrics (too vague)

**Post-v1**:
Full OpenTelemetry integration — traces and metrics across import jobs, media processing, and API surfaces.
_Avoid_: APM (product name, not requirement)

## API surface

**GraphQL API**:
The primary application API for domain data — Backstage, Import, Catalog, and personal library features. Authorization scopes what each role can query or mutate; Listeners see a restricted surface, not a separate HTTP stack.
_Avoid_: Admin API, curator API (use permissions instead)

**REST API** (intentionally narrow):
REST endpoints for operations that don't fit GraphQL well:
- **Auth** — login, register, logout, refresh, whoami (httpOnly refresh cookie). Stays REST for now; GraphQL migration deferred.
- **Media streaming** — MPEG-DASH segments and manifests
- **Media upload** — binary file uploads

_Avoid_: REST API (unqualified — implies a second domain API stack)
