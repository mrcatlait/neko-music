import { Permission } from '@neko/permissions'

export interface LoginResponseDto {
  user: {
    id: string
    username: string
  }
  permissions: Permission[]
}
