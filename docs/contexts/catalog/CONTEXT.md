# Catalog

The published library that Listeners browse and play. Read-optimized, stable surface — changes arrive only when Curators publish from Backstage.

## Language

**Catalog record**:
A published Artist, Album, Track, or Genre entity in the `catalog` schema. The authoritative copy Listeners see.
_Avoid_: Published record (redundant — catalog implies published), library item (too vague)

**Published library**:
The full set of Catalog records available to Listeners on this installation.
_Avoid_: Database (implementation), collection (ambiguous with playlists)

**Personal library** (Listener):
A Listener's own listening context on top of the shared published library — personal playlists, favorites. Target direction for post-v1; not required for the platform skeleton.
_Avoid_: User library (ambiguous with the whole installation), my music (UI copy)

**Shared catalog**:
The published library all household members draw from. Curators grow it via Import; Listeners consume it and layer personal library features on top.
_Avoid_: Global library, master library
