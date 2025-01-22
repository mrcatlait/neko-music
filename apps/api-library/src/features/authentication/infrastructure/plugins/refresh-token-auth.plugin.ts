import { Elysia, error } from 'elysia'

import { Container } from '@common/di'
import { RefreshTokenJwtStrategy } from '@features/authentication/shared/jwt'
import { JwtPayload } from '@features/authentication/shared/models'

const REFRESH_TOKEN_COOKIE_NAME = 'neko.refresh.token'

export const refreshTokenAuth = () => {
  return new Elysia({ name: 'refresh-token-auth/plugin' })
    .state({
      jwtPayload: {} as JwtPayload,
      token: '',
    })
    .decorate('refreshTokenJwtStrategy', Container.get(RefreshTokenJwtStrategy))
    .macro((ctx) => ({
      authenticated(enabled: boolean) {
        if (!enabled) return

        ctx.onBeforeHandle(async ({ cookie, refreshTokenJwtStrategy, store }) => {
          const refreshToken = cookie[REFRESH_TOKEN_COOKIE_NAME].value

          if (!refreshToken) {
            return error(401, { success: false, message: 'Unauthorized' })
          }

          const payload = await refreshTokenJwtStrategy.verify(refreshToken)

          if (!payload) {
            cookie[REFRESH_TOKEN_COOKIE_NAME].remove()
            return error(401, { success: false, message: 'Unauthorized' })
          }

          store.jwtPayload = payload
          store.token = refreshToken
        })
      },
    }))
}
