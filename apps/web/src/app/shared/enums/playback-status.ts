export const PLAYBACK_STATUS = {
  None: 'none',
  Loading: 'loading',
  Playing: 'playing',
  Paused: 'paused',
  Stopped: 'stopped',
  Ended: 'ended',
  Seeking: 'seeking',
} as const

export type PlaybackStatus = (typeof PLAYBACK_STATUS)[keyof typeof PLAYBACK_STATUS]
