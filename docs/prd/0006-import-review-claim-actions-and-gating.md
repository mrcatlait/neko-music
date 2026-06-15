## Problem Statement

Ambiguous approve/reject semantics are insufficient for reliable promotion logic and do not support replacement resolution for bad required claims.

## Solution

Adopt explicit claim actions and enforce required/optional claim policy so promotion eligibility is deterministic and auditable.

## User Stories

1. As a reviewer, I want explicit claim actions, so that each metadata decision is clear.
2. As a reviewer, I want required claim replacement resolution, so that bad extraction does not block progress.
3. As a reviewer, I want optional claims to remain optional, so that throughput remains high.

## Implementation Decisions

- Claim actions: `pending`, `link_existing`, `create_new`, `ignore`, `reject`.
- Required claims: `title`, `artist`; optional claims: `album`, `genre`, `releaseDate`.
- Required claims may be ignored only if replacement resolution is provided in same decision.
- Promotion eligibility is computed from resolved required claims.

## Testing Decisions

- Validate claim action transitions and invariants.
- Validate required-claim replacement rule enforcement.
- Validate eligibility calculation for mixed required/optional outcomes.

## Out of Scope

- Atomic promotion and staged asset handoff mechanics.
- Permission model and concurrent-review history.

## Further Notes

- Tracker slice: #173.
