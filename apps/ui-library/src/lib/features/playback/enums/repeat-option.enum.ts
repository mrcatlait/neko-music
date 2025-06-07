export const REPEAT_OPTIONS = {
  None: 'none',
  Single: 'single',
  All: 'all',
} as const

export type RepeatOption = (typeof REPEAT_OPTIONS)[keyof typeof REPEAT_OPTIONS]
