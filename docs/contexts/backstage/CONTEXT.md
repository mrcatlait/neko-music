# Backstage

The editorial workspace where Curators create, edit, review, and publish music metadata before it reaches the Catalog.

## Language

**Backstage record**:
An Artist, Album, Track, or Genre entity in the `backstage` schema — the working copy, not yet (or no longer) visible to Listeners.
_Avoid_: Draft (a status, not the entity), admin record

**Publishing**:
The act of syncing a Backstage record into its Catalog counterpart so Listeners can see it. Triggered when status becomes `Published`.
_Avoid_: Release, go-live, deploy

**Publishing status**:
The lifecycle state of a Backstage record: `Draft`, `Review`, `Published`, or `Rejected`.
_Avoid_: Status (too generic), workflow state

**Promotion** (import-specific):
Moving import-resolved content into Backstage drafts. Distinct from Publishing — promotion creates/edits Backstage records; publishing pushes them to Catalog.
_Avoid_: Publish (when referring to import → backstage), import (as a verb for this step)

## Editorial model

Backstage is the working copy; Catalog is the listener-facing copy. Curators experiment in Backstage without affecting what Listeners hear until Publishing completes.

**Ingest**:
Creating or updating Backstage drafts — via Import promotion or manual Backstage editing. Any Curator with the relevant write/review permissions.
_Avoid_: Publish (when meaning catalog sync), import (as a generic verb)

**Publish gate**:
Publishing to Catalog requires explicit promote permission (`import.promote` today) **and** Media readiness on the target entity. Ingest and edit permissions alone do not expose content to Listeners.
_Avoid_: Approval workflow (too generic), release process

**Review** (import):
Evaluating import claims — resolving metadata ambiguities before promotion to Backstage drafts. Distinct from the Backstage `Review` publishing status.
_Avoid_: Triage (issue-tracker term), QA
