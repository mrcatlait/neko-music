## Problem Statement

A single global runner mode is not robust enough for mixed source types, and imports can become fragile without restart recovery and structured retries.

## Solution

Add per-strategy concurrency controls, resume-after-restart behavior, and retry attempt tracking for failed items.

## User Stories

1. As an operator, I want per-strategy concurrency caps, so that remote sources and local sources are tuned safely.
2. As an operator, I want restart recovery, so that long-running imports survive process restarts.
3. As a reviewer, I want retry history, so that failure diagnosis remains visible.

## Implementation Decisions

- Scheduler applies strategy-specific concurrency limits within global safety cap.
- Restart bootstrap reconciles interrupted jobs/items into resumable states.
- Retry operations preserve append-only attempt history and explicit failure reasons.
- UI/API expose operational state and retry controls coherently.

## Testing Decisions

- Validate concurrency behavior under mixed strategy workloads.
- Validate recovery semantics after simulated process interruption.
- Validate retry flows and attempt-history persistence.

## Out of Scope

- Permission gating and review audit history policy.
- Storage retention policy for payload diagnostics.

## Further Notes

- Tracker slice: #171.
