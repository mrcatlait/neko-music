# Import uses a two-phase workflow (discovery then job)

Import is split into immutable discovery snapshots and execution jobs with a 1:1 mapping from job to discovery. We chose this to preserve curator intent (select-then-start), support source drift via explicit refresh snapshots, and avoid accidental imports from implicit rediscovery.

**Considered options:** single-phase import-on-submit (rejected — conflates browsing a source with committing to a long-running job); mutable discovery records (rejected — refresh creates a new snapshot instead).
