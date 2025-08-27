export interface UserCredentialsEntity {
  userId: string
  passwordHash: string
  passwordSalt: string
}

export type WithCredentials<T> = T & {
  passwordHash: string
  passwordSalt: string
}
