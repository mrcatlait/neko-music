import 'fastify'

declare module 'fastify' {
  interface Session extends fastifySession.FastifySessionObject {
    data?: UserModel
  }
  export interface FastifyRequest {
    session?: Session
    cookies: { [cookieName: string]: string | undefined }
    res: FastifyReply
  }
}
