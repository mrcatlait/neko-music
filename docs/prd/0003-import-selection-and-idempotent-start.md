## Problem Statement

Discovery alone is not useful without selective import start, and repeated user submissions can create duplicate Import Jobs unless start is idempotent.

## Solution

Allow users to select Discovery items and start Import once per Discovery snapshot, with server-side idempotency guarantees for retries.

## User Stories

1. As a Backstage editor, I want to select discovered items, so that only chosen tracks are processed.
2. As a Backstage editor, I want Start Import to be retry-safe, so that duplicate clicks do not create duplicate jobs.
3. As an operator, I want each Import Job to map to one Discovery, so that execution intent is traceable.

## Implementation Decisions

- Selection state is persisted against Discovery snapshot items.
- Start Import checks and enforces one Import Job per Discovery identity.
- API returns existing Import Job when the same start request is replayed.
- Web transitions into Import Details after successful start.

## Testing Decisions

- Validate selection persistence and Import Job item creation from selected subset only.
- Validate idempotent start under duplicate/retried requests.
- Validate one-to-one mapping invariant between Discovery and Import Job.

## Out of Scope

- Discovery refresh/new-removed diff.
- Runner execution-state split and cancellation semantics.

## Further Notes

- Tracker slice: #165.
