import { Permission } from '@modules/authorization/constants'

export interface AccessToken {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  scope: string
  permissions?: Permission[]
}
