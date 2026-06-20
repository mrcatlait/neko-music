---
status: accepted (targets the final-version rewrite)
---

# The web client is the only API consumer; the API is an internal seam

The first-party web client is the sole consumer of the application API, so we stop treating that API as a published, client-agnostic contract. The GraphQL schema becomes an internal build artifact: front-end types are generated against the live schema and the two are versioned in lockstep. We remove the consumer-driven contract machinery — Pact contract tests and the `@neko/contracts` client-DTO package — because there is no second client to protect against drift.

We kept GraphQL (over switching to tRPC-style RPC) for its data-fetching ergonomics in a catalog/curator UI and the existing Mercurius/urql/codegen investment; goal "tight coupling" is met by deleting the contract layer, not by dropping GraphQL. REST carve-outs (cookie auth, MPEG-DASH streaming, binary upload) remain as in ADR-0004.

**Considered options:** keep GraphQL as a versioned public contract with Pact (rejected — there is no external client, so the contract is pure overhead); switch to tRPC for maximal coupling (rejected — marginal gain over internal-GraphQL once the contract layer is gone, and it would discard GraphQL query ergonomics).

**Relationship:** amends the contract/Pact framing of ADR-0004; the GraphQL-for-domain / REST-for-carve-outs split itself still holds.
