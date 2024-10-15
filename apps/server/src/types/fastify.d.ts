import type { UserAccountEntity } from '../modules/user/entities'
import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: UserAccountEntity
    res: FastifyReply
  }

  export interface FastifyReply {
    startTime: number
    setHeader: (key: string, value: string) => unknown
    end: () => void
  }
}
