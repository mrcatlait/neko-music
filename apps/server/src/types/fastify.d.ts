import 'fastify'
import { User } from '@/modules/auth/interfaces'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: User
    cookies: { [cookieName: string]: string | undefined }
    res: FastifyReply
  }
}
