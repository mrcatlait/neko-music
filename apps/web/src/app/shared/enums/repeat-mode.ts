export const RepeatMode = {
  None: 'none',
  Single: 'single',
  All: 'all',
} as const

export type RepeatMode = (typeof RepeatMode)[keyof typeof RepeatMode]
