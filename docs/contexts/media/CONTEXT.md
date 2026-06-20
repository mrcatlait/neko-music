# Media

Asset storage, processing, transcoding, and adaptive streaming for Neko Music. Handles uploaded files, import handoffs, artwork transforms, and MPEG-DASH audio output.

## Language

**Source asset**:
The original file as ingested — from upload, import download, or path ingest. Input to the processing pipeline.
_Avoid_: Raw file, blob

**Processed asset**:
A transformed output ready for serving — transcoded audio segments, DASH manifest, resized artwork variants.
_Avoid_: Output file, derivative (acceptable in code)

**Media readiness**:
Whether an entity's required assets have finished processing and are streamable/displayable. Checked before Catalog publish.
_Avoid_: Ready state (too generic), processed (ambiguous)

**Processing job**:
An asynchronous unit of work that transforms source assets into processed assets (ffmpeg for audio, sharp for images).
_Avoid_: Transcode job (too narrow), queue item

**Adaptive streaming**:
MPEG-DASH playback with multiple bitrates, adjusting to the Listener's connection. Neko Music's playback model — not raw file serving.
_Avoid_: Streaming (too generic), HLS (different protocol)

## Publish gate integration

Import promotion lands content in Backstage while Media processes asynchronously. Catalog publish (via the publish gate) happens only when Media readiness confirms playback is available. Listeners never see unprepared content.
