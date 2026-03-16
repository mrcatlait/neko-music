export const PlaybackStatus = {
  None: 'none',
  Loading: 'loading',
  Playing: 'playing',
  Paused: 'paused',
  Stopped: 'stopped',
  Ended: 'ended',
  Seeking: 'seeking',
} as const

export type PlaybackStatus = (typeof PlaybackStatus)[keyof typeof PlaybackStatus]
