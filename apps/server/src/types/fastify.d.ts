import 'fastify'
import { fastifySession } from '@fastify/session'

import type { UserModel } from '@modules/authorization/models'

declare module 'fastify' {
  interface Session extends fastifySession.FastifySessionObject {
    data?: UserModel
  }
  export interface FastifyRequest {
    session: Session
    res: FastifyReply
  }

  export interface FastifyReply {
    startTime: number
    setHeader: (key: string, value: string) => unknown
    end: () => void
  }
}
