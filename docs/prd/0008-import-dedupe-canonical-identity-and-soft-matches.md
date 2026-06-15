## Problem Statement

Re-importing the same source item can create duplicates unless identity is canonicalized, while metadata-only duplicates need human review.

## Solution

Normalize source identities at strategy boundary and implement two-level dedupe: hard duplicate auto-link/skip and soft duplicate manual review suggestion.

## User Stories

1. As an operator, I want canonical source references, so that hard dedupe remains deterministic.
2. As a reviewer, I want probable duplicates surfaced, so that I can merge or intentionally keep separate records.
3. As a user, I want safe reimport behavior, so that repeated imports are idempotent.

## Implementation Decisions

- Canonical source reference is generated per strategy before dedupe decisions.
- Hard duplicates use `strategyKey + canonicalSourceRef`.
- Soft duplicates rely on metadata similarity and remain reviewer-mediated.
- Dedupe outcomes integrate with import review/promotion paths.

## Testing Decisions

- Validate canonicalization for common source reference variants.
- Validate hard duplicate auto-link/skip behavior.
- Validate soft duplicate surfacing without forced auto-merge.

## Out of Scope

- Claim action semantics.
- Resume/restart runner behavior.

## Further Notes

- Tracker slice: #168.
