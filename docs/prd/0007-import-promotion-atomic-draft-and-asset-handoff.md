## Problem Statement

Without atomic promotion, review outcomes can create partial catalog state or orphan staging assets.

## Solution

Promote eligible Import Job Items in one transaction that applies deferred create/link decisions, creates Backstage draft state, and transitions staged assets to canonical ownership.

## User Stories

1. As a reviewer, I want promotion to apply all resolved decisions together, so that draft records are consistent.
2. As an operator, I want staged assets moved only at promotion, so that unreviewed files do not pollute canonical storage.
3. As a reviewer, I want failed promotion to be retryable, so that partial side effects are avoided.

## Implementation Decisions

- Promotion runs only for items with required claims resolved.
- Deferred entity create/link decisions execute during promotion transaction.
- Staging-to-canonical asset transition is part of promotion boundary.
- Failures keep item retryable and preserve import workspace integrity.

## Testing Decisions

- Validate transaction atomicity across catalog updates and asset handoff.
- Validate rollback/no-partial-state on promotion failure.
- Validate retry behavior after failed promotion attempts.

## Out of Scope

- Claim action model design.
- Dedupe heuristics and duplicate review UI.

## Further Notes

- Tracker slice: #170.
