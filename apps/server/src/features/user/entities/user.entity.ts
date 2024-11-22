export interface UserEntity {
  id: string
  username: string
  email: string
  password_hash: string
  permissions: string[]
}
