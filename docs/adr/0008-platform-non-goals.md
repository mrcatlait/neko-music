# Platform non-goals

Neko Music explicitly does not target: multi-tenant SaaS hosting, licensed streaming catalogs (Spotify-style), or federation / ActivityPub between installations. Content comes from what the household imports or uploads. Native mobile apps are undecided; near-term client strategy is web/PWA (installable for skeleton, background playback bar post-skeleton) before any native investment.

**Consequences:** no tenant isolation, licensing integrations, or cross-instance social graph in architecture plans. Backup is operator responsibility for v1 (PostgreSQL + media directory); metadata export tooling is post-v1.
