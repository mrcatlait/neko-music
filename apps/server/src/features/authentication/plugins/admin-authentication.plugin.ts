import { Elysia } from 'elysia'

import { Session } from '../models'

import { UnauthorizedException } from '@common/exceptions'

export const ADMIN_SESSION_COOKIE = 'neko.admin.session'

export const adminAuthenticationPlugin = new Elysia({
  name: 'admin-authentication/plugin',
})
  .state({
    session: new Map<string, Session>(),
  })
  .macro((ctx) => ({
    authenticatedAdmin(enabled: boolean) {
      if (!enabled) return

      ctx.onBeforeHandle(({ cookie, store: { session } }) => {
        return {
          adminAuth: async () => {
            const session = cookie.admin_session
            if (!session) {
              throw new UnauthorizedException()
            }

            const user = await UserSessionService.validate(session)
            if (!user) {
              throw new UnauthorizedException()
            }

            // Check if user has any admin permissions
            const hasAdminAccess = await PermissionService.hasAnyPermission(user.id, Object.values(ADMIN_PERMISSIONS))

            if (!hasAdminAccess) {
              throw new UnauthorizedException('Insufficient permissions')
            }

            return user
          },
        }
      })
    },
  }))
  .resolve({ as: 'scoped' }, ({ store: { session }, cookie }) => {
    if (!cookie[ADMIN_SESSION_COOKIE].value) {
      return {
        user: {
          id: '',
          username: '',
        },
      }
    }

    const sessionData = session.get(cookie[ADMIN_SESSION_COOKIE].value)

    if (!sessionData) {
      cookie[ADMIN_SESSION_COOKIE].remove()
      return {
        user: {
          id: '',
          username: '',
        },
      }
    }

    return { user: sessionData.user }
  })
