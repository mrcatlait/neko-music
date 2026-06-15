## Problem Statement

External sources change over time, so stale Discovery snapshots can produce surprising imports and hide newly available items.

## Solution

Implement refresh as a new Discovery snapshot with carry-over selection by canonical source identity, explicit drift indicators, and configurable snapshot expiration.

## User Stories

1. As a Backstage editor, I want refresh to create a new snapshot, so that earlier discovery remains immutable.
2. As a Backstage editor, I want prior selections carried to matching items, so that large imports are manageable.
3. As an operator, I want discovery TTL, so that stale snapshots cannot be started accidentally.

## Implementation Decisions

- Refresh never mutates existing Discovery; it creates a new record.
- Canonical source reference drives carry-over selection and diff classification.
- Diff exposes new/removed/unchanged items for user confirmation.
- `discoveryTtlDays` module option controls start eligibility.

## Testing Decisions

- Validate refresh snapshot creation and immutability of prior Discovery.
- Validate carry-over selection and new/removed diff behavior.
- Validate expired Discovery start rejection behavior.

## Out of Scope

- Import runner state machine and cancel behavior.
- Claim review and promotion policies.

## Further Notes

- Tracker slice: #166.
