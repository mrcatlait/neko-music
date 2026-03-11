export const Roles = {
  /**
   * Role for administrator users
   */
  Administrator: 'administrator',
  /**
   * Role for regular users
   */
  User: 'user',
} as const

export type Role = (typeof Roles)[keyof typeof Roles]
