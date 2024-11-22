import { Elysia, t } from 'elysia'

import { Session } from '../models'

import { UnauthorizedException } from '@common/exceptions'

export type AuthenticationPlugin = typeof authenticationPlugin

export const SESSION_COOKIE = 'neko.session'

export const authenticationPlugin = new Elysia({
  name: 'authentication/plugin',
})
  .state({
    session: new Map<string, Session>(),
  })
  .macro((ctx) => ({
    authenticated(enabled: boolean) {
      if (!enabled) return

      ctx.onBeforeHandle(({ cookie, store: { session } }) => {
        if (!cookie[SESSION_COOKIE].value) {
          throw new UnauthorizedException()
        }

        const hasSession = session.has(cookie[SESSION_COOKIE].value)

        if (!hasSession) {
          throw new UnauthorizedException()
        }
      })
    },
  }))
  .resolve({ as: 'scoped' }, ({ store: { session }, cookie }) => {
    if (!cookie[SESSION_COOKIE].value) {
      return {
        user: {
          id: '',
          username: '',
        },
      }
    }

    const sessionData = session.get(cookie[SESSION_COOKIE].value)

    if (!sessionData) {
      cookie[SESSION_COOKIE].remove()
      return {
        user: {
          id: '',
          username: '',
        },
      }
    }

    return { user: sessionData.user }
  })
