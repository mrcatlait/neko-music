# Backstage and Catalog are separate editorial and published layers

Curators work in **Backstage** (`backstage` schema); **Listeners** see only **Catalog** (`catalog` schema) after explicit publishing sync. We chose a two-layer model so editorial work — drafts, rejected records, in-progress metadata — never leaks to the listening surface, and published catalog records stay stable while backstage churn continues.

**Considered options:** single store with visibility flags (rejected — couples listener queries to editorial state); catalog as event-projected read model (deferred — separate schemas with sync use cases are sufficient for v1).
