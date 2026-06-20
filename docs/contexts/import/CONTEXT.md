# Import

The primary on-ramp for bringing external music into Neko Music. Curators select a source, snapshot what is available, run an import job, review claims, and promote results into Backstage drafts.

Import-first: most library growth flows through here; manual Backstage entry is for corrections and edge cases.

## Language

**Import source**:
An external origin for music — YouTube track/playlist, local folder, file upload, S3 bucket, etc. Identified by a strategy key discovered at runtime from the server.
_Avoid_: Provider (too generic), connector

**Import method**:
A registered strategy that knows how to talk to one kind of source. The web client discovers available methods from the backend — never hardcoded source lists.
_Avoid_: Plugin (implementation term), adapter (acceptable in code, not glossary)

**Discovery**:
The interactive phase where a Curator configures a source and the system snapshots what is available — titles, track counts, metadata claims — without downloading or processing yet.
_Avoid_: Scan (ambiguous), fetch (too vague)

**Discovery snapshot**:
An immutable record of what a source offered at a point in time. Preserves Curator intent and supports refresh when the source drifts.
_Avoid_: Preview (UI term), cache

**Import job**:
The execution phase that processes a discovery snapshot — downloads media, extracts claims, runs dedupe — producing items ready for review and promotion.
_Avoid_: Task, run (too generic)

**Claim**:
A piece of metadata extracted from a source about one track or album — e.g. title, artist, duration. Claims are reviewed individually before promotion.
_Avoid_: Field, attribute, metadata (too broad)

**Promotion** (import → backstage):
Creating or updating Backstage drafts from resolved import items. Requires required claims (`title`, `artist`) to be resolved; optional claims may be omitted. See ADR-0012.
_Avoid_: Publish (that is backstage → catalog)

## Workflow

Discovery is interactive. Analysis is asynchronous. Review is editorial.

Two-phase model (ADR-0011): one discovery snapshot maps 1:1 to an import job. Refresh creates a new snapshot rather than mutating the old one.

**Import workspace**:
The long-lived Backstage surface for import operations — list active and historical imports, monitor progress, resume review, retry failures. Creating an import is a flow into the workspace, not a one-shot wizard.
_Avoid_: Wizard (describes the create flow, not the whole module), import page

## Dedupe

**Canonical source reference**:
A strategy-normalized identifier for a source or item (`strategyKey + normalized ref`). Generated at the strategy boundary so dedupe is stable across URL variants and formatting differences.
_Avoid_: Source ID (too generic), external ID

**Hard duplicate**:
The same canonical source item ref was already imported. Re-import skips re-processing (idempotent) and links the Curator to the existing Backstage/Catalog record — never silent.
_Avoid_: Exact duplicate, duplicate row

**Soft duplicate**:
Probable same song from a different source (e.g. YouTube vs local file) based on metadata similarity. Surfaced as a reviewer suggestion — Curator merges or intentionally keeps separate; never auto-merged.
_Avoid_: Possible duplicate (too vague), match
