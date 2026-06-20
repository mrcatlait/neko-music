# Context Map

Neko Music is a self-hosted music platform for a small household or community: a few **Curators** manage content in **Backstage**; **Listeners** consume the published **Catalog**.

## Contexts

- [Platform](./docs/contexts/platform/CONTEXT.md) — product identity, users, roles, and cross-cutting vocabulary
- [Catalog](./docs/contexts/catalog/CONTEXT.md) — the published library listeners browse and play
- [Backstage](./docs/contexts/backstage/CONTEXT.md) — editorial workspace where curators draft, review, and publish catalog records
- [Import](./docs/contexts/import/CONTEXT.md) — ingestion pipeline from external sources into Backstage drafts
- [Media](./docs/contexts/media/CONTEXT.md) — asset storage, processing, transcoding, and adaptive streaming

## Relationships

- **Import → Backstage**: Discovery snapshots and jobs (ADR-0011); claim review and promotion into backstage drafts (ADR-0012, ADR-0009)
- **Backstage → Catalog**: Publishing syncs a Backstage record into its Catalog counterpart; listeners only see Catalog (ADR-0002, ADR-0007)
- **Import → Media**: Import strategies hand off downloaded or uploaded files to Media for processing
- **Backstage → Media**: Backstage entities reference processed media assets (artwork, audio) before publish
- **Media → Catalog**: Catalog publish is blocked until Media readiness confirms streamable content
- **Platform → all**: RBAC permissions (`@neko/permissions`) gate who can curate, review imports, or listen
- **Platform API**: GraphQL for application domain data; REST for auth, media streaming, and uploads
