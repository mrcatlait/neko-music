## Problem Statement

Neko Music needs an additional ingestion path that imports user-owned music metadata and assets from external sources while preserving trust, data ownership, and editorial quality. The current import scaffolding does not yet provide a complete, explicit workflow for immutable discovery, asynchronous execution, claim-level review, and safe promotion into Backstage drafts.

## Solution

Implement a two-phase Import Strategy workflow:

1. Discovery creates an immutable snapshot of source items.
2. Import Job executes only the selected items from that snapshot.

Execution and review lifecycles are modeled separately. Imported items produce claim-level review actions, and promotion to Backstage draft records occurs only when required claims are resolved. Strategy capabilities are served by backend runtime contracts, while v1 strategy loading remains in-process.

## User Stories

1. As a Backstage editor, I want to discover source items before import, so that I can verify source scope.
2. As a Backstage editor, I want to select only some discovered items, so that I can control what enters my library.
3. As a Backstage editor, I want each import to map to one discovery snapshot, so that execution intent remains explicit.
4. As a Backstage editor, I want discovery refresh to create a new snapshot, so that source drift is visible.
5. As a Backstage editor, I want selection carry-over on refresh by canonical identity, so that large imports are practical.
6. As a Backstage editor, I want Start Import to be idempotent per discovery snapshot, so that retries do not duplicate jobs.
7. As an operator, I want discovery expiration to be configurable, so that stale snapshots are controlled.
8. As a Backstage editor, I want execution status and review status to be separate, so that ingest completion is not confused with editorial completion.
9. As a reviewer, I want claim-level review actions, so that every metadata decision is explicit and auditable.
10. As a reviewer, I want to link claims to existing records, so that catalog consistency improves.
11. As a reviewer, I want to create new records from claims during promotion, so that abandoned reviews do not create orphan entities.
12. As a reviewer, I want to ignore bad optional claims, so that low-value data does not block progress.
13. As a reviewer, I want required claims to allow replacement resolution, so that bad extraction never deadlocks promotion.
14. As a reviewer, I want required claims (`title`, `artist`) to gate promotion, so that drafts are minimally valid.
15. As a reviewer, I want optional claims (`album`, `genre`, `releaseDate`) to remain optional, so that throughput remains high.
16. As an operator, I want staged assets isolated from canonical storage until promotion, so that unreviewed content never pollutes the library.
17. As an operator, I want hard duplicate detection by strategy key + canonical source reference, so that re-import is safe and idempotent.
18. As a reviewer, I want soft duplicate suggestions by metadata similarity, so that I can merge or keep separate records.
19. As an operator, I want strategy-specific concurrency limits, so that remote and local imports are tuned safely.
20. As an operator, I want imports to resume after restart, so that long-running jobs remain resilient.
21. As a reviewer, I want graceful cancel behavior, so that in-flight item processing is not corrupted.
22. As a maintainer, I want backend-driven import capability contracts, so that web source options do not drift from server truth.
23. As a team member, I want permission-based review/promote/retry/manage actions, so that governance is explicit.
24. As a team member, I want concurrent review with last-write-wins and append-only history, so that collaboration stays lightweight but auditable.
25. As an operator, I want no raw extractor payload persistence by default, so that storage cost/noise remains bounded.

## Implementation Decisions

- Canonical domain language is recorded in `CONTEXT.md` (Import Strategy, Strategy Key, Discovery, Promotion, Hard Duplicate, etc.).
- Import is modeled as Discovery -> Import Job with strict 1:1 mapping between execution job and discovery snapshot.
- Distinct strategy keys are used for user-facing methods (`youtube.playlist`, `youtube.track`, `filesystem.folder`).
- Import capabilities are runtime-discovered from backend contracts, replacing hardcoded web data source lists.
- Claim review uses action-based outcomes instead of ambiguous approval semantics:
  - `pending`
  - `link_existing`
  - `create_new`
  - `ignore`
  - `reject`
- Required claim policy:
  - required: `title`, `artist`
  - optional: `album`, `genre`, `releaseDate`
  - required claims may be ignored only when replacement resolution is supplied in the same action.
- Promotion policy:
  - occurs after required claims are resolved
  - optional unresolved claims are omitted
  - entity creation/linking executes atomically during promotion
  - staged assets transition to canonical ownership at promotion.
- Automation and operations:
  - confidence-guarded auto-resolution for obvious matches
  - module option `autoPromoteEligibleItems` default `false`
  - module option `discoveryTtlDays`
  - per-strategy concurrency caps with global safety ceiling
  - graceful cancel via cancel-requested state
  - resumable queue behavior after process restarts.
- Dedupe and idempotency:
  - hard duplicate by strategy key + canonical source reference
  - soft duplicate by metadata similarity
  - Start Import idempotent per discovery.
- Data retention:
  - raw source payloads are not persisted by default
  - persist normalized provenance, extracted claims, and diagnostics only.

## Testing Decisions

- Good tests validate observable behavior at use-case/service boundaries and avoid implementation-detail assertions.
- Existing high seams should be preferred:
  - import orchestration seams (use-case/runner/services)
  - strategy seams (YouTube strategy behavior)
  - promotion/review seams (claim processing and decision application)
  - capability contract seam (backend -> web source rendering).
- Prior art:
  - import strategy behavioral tests
  - media use-case orchestration tests with mocked repositories/services
  - database service lifecycle tests for bootstrap/retry flows.
- Coverage focus:
  - discovery lifecycle and idempotent start
  - claim action validation, required replacement rule
  - promotion atomicity and optional-field omission
  - duplicate detection behavior
  - restart resume and graceful cancel
  - web behavior driven by capability contracts instead of hardcoded providers.

## Out of Scope

- Runtime loading of arbitrary external plugin packages (v1 remains in-process strategies).
- Full pessimistic locking for review workflows.
- Multi-artist import modeling in v1 (single artist retained).
- Long-term archival of full raw extractor payload blobs.
- Final publication workflows beyond draft creation in Backstage.

## Further Notes

- This PRD aligns with ADRs:
  - `0001-import-two-phase-workflow`
  - `0002-claim-level-review-and-promotion-gate`
  - `0003-in-process-strategies-runtime-capabilities`
  - `0004-no-raw-payload-persistence-by-default`
- It prioritizes clarity, reversibility, and user trust in a self-hosted OSS system where data ownership and safe operations are first-class concerns.
