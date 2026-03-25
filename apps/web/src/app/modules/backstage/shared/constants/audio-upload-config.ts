/** Mirrors server `MediaModuleOptions` audio limits in `app.module.ts`. */
export const AUDIO_UPLOAD_CONFIG = {
  maxFileSize: 100 * 1024 * 1024,
  allowedTypes: [
    'audio/mpeg',
    'audio/mp3',
    'audio/mp4',
    'audio/m4a',
    'audio/aac',
    'audio/ogg',
    'audio/wav',
    'audio/webm',
  ],
}
