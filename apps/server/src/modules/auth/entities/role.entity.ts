export interface RoleEntity {
  id: string
  name: string
  description: string
  default: boolean
}

export type WithRole<T> = T & {
  role: RoleEntity
}
