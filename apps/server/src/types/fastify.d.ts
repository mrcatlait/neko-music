import type { AccessToken } from '@core/models'
import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: AccessToken
    res: FastifyReply
  }

  export interface FastifyReply {
    startTime: number
    setHeader: (key: string, value: string) => unknown
    end: () => void
  }
}
