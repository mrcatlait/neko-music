# Import dedupe: hard skip with link, soft review only

Re-importing the same canonical source item (`strategyKey + normalized ref`) is idempotent — processing is skipped and the Curator is linked to the existing record, never silently dropped. Probable duplicates across different sources (metadata similarity) are surfaced for reviewer decision; they are never auto-merged. We chose two-level dedupe to keep repeated imports safe while avoiding polluted catalog metadata from aggressive automatic merging.

**Considered options:** silent hard-dedupe skip (rejected — opaque in a long-lived import workspace); force re-import on every run (rejected — wasteful and noisy for playlists).
