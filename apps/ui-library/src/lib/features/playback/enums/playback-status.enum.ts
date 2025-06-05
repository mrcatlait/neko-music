export const PLAYBACK_STATUS = {
  Pending: 'pending',
  Playing: 'playing',
  Paused: 'paused',
  Stopped: 'stopped',
  Loading: 'loading',
} as const;

export type PlaybackStatus = (typeof PLAYBACK_STATUS)[keyof typeof PLAYBACK_STATUS];