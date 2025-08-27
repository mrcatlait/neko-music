export const AUTH_STATUS = {
  Idle: 'Idle',
  Loading: 'Loading',
  Success: 'Success',
  Error: 'Error',
} as const

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS]
