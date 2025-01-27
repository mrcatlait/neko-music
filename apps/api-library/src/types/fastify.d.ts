import 'fastify'
import { JwtPayload } from '@modules/authentication/shared/models'

declare module 'fastify' {
  interface FastifyRequest extends SignerMethods {
    /**
     * Request cookies
     */
    cookies: { [cookieName: string]: string | undefined }
    payload: JwtPayload
  }
}
