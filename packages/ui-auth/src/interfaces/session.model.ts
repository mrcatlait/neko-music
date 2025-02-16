import { Permission } from '@neko/permissions'

export interface Session {
  userId: string
  username: string
  permissions: Permission[]
}
