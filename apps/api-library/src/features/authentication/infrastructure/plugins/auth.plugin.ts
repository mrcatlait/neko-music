import { Elysia, error, t } from 'elysia'
import { JWTPayload } from 'jose'

import { bearer } from './bearer.plugin'

import { Container } from '@common/di'
import { AuthTokenJwtStrategy } from '@features/authentication/shared/jwt'

export const auth = () => {
  return new Elysia({ name: 'auth/plugin' })
    .state({
      jwtPayload: {} as JWTPayload,
    })
    .use(bearer())
    .decorate('authTokenJwtStrategy', Container.get(AuthTokenJwtStrategy))
    .guard({
      headers: t.Object({
        authorization: t.String(),
      }),
    })
    .macro((ctx) => ({
      authenticated(enabled: boolean) {
        if (!enabled) return

        ctx.onBeforeHandle(async ({ token, authTokenJwtStrategy, store }) => {
          if (!token) {
            return error(401, { success: false, message: 'Unauthorized' })
          }

          const payload = await authTokenJwtStrategy.verify(token)

          if (!payload) {
            return error(401, { success: false, message: 'Unauthorized' })
          }

          store.jwtPayload = payload
        })
      },
    }))
}

export const getUserId = new Elysia({ name: 'get-user-id/plugin' })
  .use(auth())
  // .guard({
  //   cookie: 'session',
  // })
  .resolve(({ store: { jwtPayload } }) => ({
    userId: jwtPayload.sub,
  }))
