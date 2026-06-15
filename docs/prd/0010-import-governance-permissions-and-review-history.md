## Problem Statement

Import review and promotion need explicit governance boundaries and auditable history, especially under concurrent review with last-write-wins semantics.

## Solution

Enforce permission-based actions and persist append-only review decision history while allowing concurrent updates to current decision state.

## User Stories

1. As an administrator, I want granular import permissions, so that responsibilities are explicit.
2. As a reviewer, I want concurrent review to stay lightweight, so that collaboration is fast.
3. As an auditor, I want full decision history, so that overwrite timelines are traceable.

## Implementation Decisions

- Guard actions by capability: `import.review`, `import.promote`, `import.retry`, `import.manage`.
- Concurrent review applies last-write-wins to current state.
- Every decision change is appended to immutable history (`who/when/from/to/reason`).
- Access checks and history are enforced in API mutation boundaries.

## Testing Decisions

- Validate permission checks for each protected action.
- Validate last-write-wins semantics for concurrent decision updates.
- Validate append-only history integrity and actor attribution.

## Out of Scope

- Full pessimistic locking workflow.
- Role-model redesign outside import capabilities.

## Further Notes

- Tracker slice: #172.
