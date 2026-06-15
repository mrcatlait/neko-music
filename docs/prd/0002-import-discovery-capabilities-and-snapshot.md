## Problem Statement

Import source options in web are hardcoded and can drift from server behavior, and there is no complete end-to-end Discovery snapshot flow as a first-class contract.

## Solution

Expose Import Strategy capabilities from backend at runtime and use them in web to drive source selection and Discovery creation. Persist Discovery as an immutable snapshot.

## User Stories

1. As a Backstage editor, I want to see available import methods from server, so that UI always matches backend capabilities.
2. As a Backstage editor, I want to create Discovery from a chosen strategy input, so that I can inspect source items before import.
3. As a maintainer, I want stable strategy keys in capability contracts, so that integrations remain deterministic.

## Implementation Decisions

- Backend provides capability metadata for each Import Strategy.
- Web source selection and configuration are rendered from capability contracts, not static providers.
- Discovery creation persists immutable snapshot data and references strategy key/input context.
- Capability contract uses canonical domain language from `CONTEXT.md`.

## Testing Decisions

- Validate capability contract shape and strategy-key stability at API boundary.
- Validate web renders source choices from backend response and can submit Discovery creation.
- Validate Discovery record persistence and retrievability.

## Out of Scope

- Selection persistence and import-job creation.
- Refresh diff behavior and discovery TTL enforcement.

## Further Notes

- Tracker slice: #164.
