import { Permission } from '@neko/permissions'
import { SetMetadata } from '@nestjs/common'

export const PERMISSIONS_KEY = 'permissions'
export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions)
