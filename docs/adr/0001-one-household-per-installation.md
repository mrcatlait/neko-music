# One household per installation

Neko Music serves a small household or community — several Curators and Listeners sharing one library on one server — not a multi-tenant SaaS product. We chose this because the product promise is self-hosted ownership ("your server, your files"), RBAC is household-scoped, and tenant isolation would dominate architecture without matching user demand.

**Considered options:** multi-tenant SaaS (rejected — out of product scope); single owner with no roles (rejected — permissions scaffolding already targets multiple curators).
