# GraphQL for domain data; REST for auth, streaming, and uploads

Application domain data (Backstage, Import, Catalog, personal library when built) is exposed through GraphQL. REST is reserved for session auth (httpOnly refresh cookie), MPEG-DASH streaming, and binary uploads. We chose this split because GraphQL fits curator workflows and permission-scoped queries, while cookie-based auth and binary media operations are awkward and well-trodden on REST. Auth on GraphQL is deferred — not rejected — until dual-client refresh and contract tooling are ready.

**Considered options:** GraphQL only (rejected for now — auth cookie mechanics and `@neko/contracts` Pact story are cleaner on REST); dual REST+GraphQL domain APIs (rejected — duplicates surface area and drift risk).
