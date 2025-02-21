import { Permission } from '@neko/permissions'

export interface Session {
  userId: string
  displayName: string
  permissions: Permission[]
}
