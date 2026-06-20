---
status: accepted (targets the final-version rewrite)
---

# Extensibility is back-end Strategies only; no front-end or API plugins

The only third-party extension surface is the back end, via Strategies selected and configured in `bootstrap(config)`. A Strategy is an npm package implementing a fixed platform interface (import source, storage, transcode, metadata/enrichment, scrobbler, auth backend). Strategies declare a descriptor of their capabilities and required settings; the first-party web client renders that descriptor generically, so a new Strategy needs no bespoke UI. There is no front-end plugin system, and third parties cannot add routes, GraphQL schema, or entities. Internally the platform is a modular monolith — cohesive feature modules (Catalog, Backstage, Import, Media) with Strategy seams at the edges — not a plugin kernel.

We evaluated a Vendure-style dashboard-plugin model (third-party UI + schema extension) and rejected it: OSS self-hosted music shows strong demand for back-end extension (metadata, scrobblers, sources, auth) but little to none for third-party custom UI routes, which is e-commerce-shaped demand Neko does not have. Scoping extension to Strategies keeps one first-party web client (serving the tight-coupling and single-deployable goals) while still letting motivated operators add back-end capabilities.

**Considered options:** Vendure-style plugins contributing UI + schema (rejected — high complexity for near-zero domain demand; would force route-injection constraints onto the front-end and an untrusted-UI trust model); everything-is-a-plugin internally on a kernel (rejected — machinery for an internal-only benefit once third-party feature-plugins are off the table); drop third-party extension entirely (rejected — back-end Strategy demand is real).

**Relationship:** affirms and extends ADR-0010 (in-process strategy seams with runtime capability discovery) as the enduring extension model; the descriptor-driven UI generalises ADR-0010's runtime method discovery to all Strategy types.

**Consequences:** a Strategy with genuinely bespoke configuration UI cannot be expressed beyond what the descriptor supports — an accepted ceiling, since real Strategies need only keys, paths, toggles, and choices.
