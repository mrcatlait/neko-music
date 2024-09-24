import { Role } from './role.model'

export interface AccessToken {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  scope: string
  roles?: Role[]
}
