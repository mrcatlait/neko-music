export interface PermissionEntity {
  id: string
  name: string
  description: string
}

export type WithPermissions<T> = T & {
  permissions: PermissionEntity[]
}
