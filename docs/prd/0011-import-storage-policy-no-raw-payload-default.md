## Problem Statement

Persisting full raw extractor payloads (for example large yt-dlp JSON blobs) adds storage cost and noise without meaningful workflow value.

## Solution

Default import persistence to normalized provenance, extracted claims, and diagnostics only, with raw payload storage disabled by default.

## User Stories

1. As an operator, I want lean import storage, so that database growth remains controlled.
2. As a reviewer, I want enough diagnostics for troubleshooting, so that failures remain actionable.
3. As a maintainer, I want retention policy to match ADR intent, so that implementation stays aligned with design decisions.

## Implementation Decisions

- Full raw source payload persistence is disabled by default.
- Persist normalized provenance, claim extraction metadata, and bounded diagnostics.
- Storage policy is enforced across successful and failed item processing paths.
- Policy aligns with ADR `0004-no-raw-payload-persistence-by-default`.

## Testing Decisions

- Validate no raw payload blob is stored by default.
- Validate required diagnostic fields remain available after ingestion failures.
- Validate policy behavior across retries and resumed processing.

## Out of Scope

- Long-term archival of raw payload dumps.
- Broad observability platform integration.

## Further Notes

- Tracker slice: #169.
