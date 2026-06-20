# v1 targets a deployable platform skeleton

v1 proves architecture end-to-end, not a polished household product. The skeleton is done when `docker compose up` on a fresh machine — with only `.env` secrets and seeded administrator credentials — allows a Curator to import via **YouTube track or playlist**, publish to Catalog, and a Listener to play back. Import-first is the content on-ramp; personal library, invite UX, soft dedupe, and import retention policy are post-v1. Observability stack is optional for skeleton-done; full OpenTelemetry integration follows later.

**Considered options:** full household UX including personal playlists in v1 (rejected — spreads effort while import is still in flux); technical pipeline only without deployable proof (rejected — self-hosted product must run on a fresh install).
