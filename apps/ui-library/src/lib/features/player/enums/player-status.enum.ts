export const PLAYER_STATUS = {
  Pending: 'pending',
  Loading: 'loading',
  Playing: 'playing',
  Paused: 'paused',
} as const;

export type PlayerStatus = (typeof PLAYER_STATUS)[keyof typeof PLAYER_STATUS];
