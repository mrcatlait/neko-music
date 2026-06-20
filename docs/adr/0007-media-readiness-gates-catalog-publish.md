# Catalog publish requires media readiness

Content may land in Backstage while media processes asynchronously, but Catalog publish — manual or automatic — proceeds only when media readiness confirms streamable audio and required artwork. We chose this so Listeners never encounter catalog records they cannot play, keeping the published library trustworthy even when ingest and transcode lag behind metadata promotion.

**Considered options:** metadata-first catalog with "preparing" playback states (rejected — pushes complexity to listener UX); block at import promotion instead of publish (rejected — curators need backstage visibility of in-flight processing).
