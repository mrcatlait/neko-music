## Problem Statement

Execution progress and editorial review progress can be conflated, and abrupt cancellation risks corrupting in-flight processing.

## Solution

Split execution lifecycle from review lifecycle and implement graceful cancellation that stops new scheduling while allowing in-flight item completion.

## User Stories

1. As a reviewer, I want clear execution statuses independent of review, so that import state is unambiguous.
2. As an operator, I want graceful cancel, so that tool pipelines are not interrupted unsafely.
3. As a Backstage editor, I want cancellation progress reflected in UI, so that behavior is predictable.

## Implementation Decisions

- Execution and review use separate status models.
- Cancel transitions to cancel-requested state and suppresses new item scheduling.
- In-flight item processing is allowed to complete before final canceled state.
- API/UI surfaces cancellation progress and final outcomes.

## Testing Decisions

- Validate lifecycle separation in responses and UI rendering.
- Validate cancel-requested scheduling behavior.
- Validate no new items start after cancel while active items complete.

## Out of Scope

- Per-strategy concurrency and restart resume.
- Claim actions and promotion gating.

## Further Notes

- Tracker slice: #167.
