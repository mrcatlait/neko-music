# Import strategies are in-process with runtime capability discovery

> Extended by ADR-0015: this remains the enduring extension model, generalised to all Strategy types (storage, transcode, metadata, auth) via descriptor-driven UI, and confirmed as the *only* third-party extension surface.

Import methods are registered in-process at startup (e.g. `YoutubeImportStrategy`) with stable strategy keys; the web client discovers available methods from the backend at runtime. v1 ships one default implementation per strategy type. We chose in-process registration over a plugin marketplace or hot-loading because it keeps v1 operationally simple and safe while preserving interfaces for motivated operators to swap storage, transcoders, or sources later.

**Considered options:** out-of-process plugins (rejected for v1 — operational and security complexity); hardcoded source lists in the frontend (rejected — causes frontend/backend drift as strategies grow).
