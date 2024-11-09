import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { Permission } from '@neko/permissions'

import { UserModel } from '@modules/authorization/models'

export const mockedUser: UserModel = {
  user: {
    id: '27611d59-1f98-44fb-a7e8-95fc605b5595',
    username: 'mockUsername',
  },
  permissions: [Permission.TrackRead],
}

export const mockSessionMiddleware = (req: FastifyRequest, res: FastifyReply, done: HookHandlerDoneFunction) => {
  const isAuthenticated = Boolean(req.headers.authorization)

  if (isAuthenticated) {
    req.session.set('data', mockedUser)
  }

  done()
}
