# Claim-level review gates promotion to Backstage

Editorial review is modeled at claim level, and promotion to Backstage is allowed only when required claims (`title`, `artist`) are resolved; optional claims may be omitted. We chose this to keep automation throughput high while preserving auditability and preventing low-quality or ambiguous metadata from polluting backstage drafts.

**Considered options:** all-or-nothing item approval (rejected — too coarse for large playlists); auto-promote without review (rejected — conflicts with ingest/publish quality bar).
