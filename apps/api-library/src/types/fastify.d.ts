import 'fastify'
import { UserSession } from '@/modules/auth/interfaces'

declare module 'fastify' {
  interface Session extends fastifySession.FastifySessionObject {
    data?: UserSession
  }
  export interface FastifyRequest {
    session?: Session
    cookies: { [cookieName: string]: string | undefined }
    res: FastifyReply
  }
}
