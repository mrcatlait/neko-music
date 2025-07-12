export const REPEAT_MODE = {
  None: 'none',
  Single: 'single',
  All: 'all',
} as const

export type RepeatMode = (typeof REPEAT_MODE)[keyof typeof REPEAT_MODE]
