# Ingest and publish are separate permission tiers

Curators with ingest permissions (import, backstage edit, claim review) can prepare content, but syncing to Catalog requires explicit publish permission (`import.promote` today). We chose this split so a household can separate "build the library" from "what goes live for Listeners" without a full editorial queue on every edit.

**Considered options:** trust all curators to publish (rejected — too risky for shared households); mandatory review status on every backstage record before publish (rejected for v1 — heavier than needed when publish permission alone suffices).
