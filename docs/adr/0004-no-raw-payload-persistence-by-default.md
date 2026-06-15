# Raw source payloads are not persisted by default

Import does not store full raw source payloads (for example, full yt-dlp JSON) in the database by default; only normalized provenance, extracted claims, and diagnostics are retained. We chose this to reduce storage bloat and noise while keeping the data needed for review, troubleshooting, and audit trails.
