import { Logger } from '@nestjs/common'
import { FastifyInstance } from 'fastify'

const now = () => Date.now()

export const setupLogger = (fastify: FastifyInstance): void => {
  const logger = new Logger()

  fastify.addHook('onRequest', (request, reply, done) => {
    reply.startTime = now()

    reply.setHeader = function (key, value) {
      return this.raw.setHeader(key, value)
    }
    reply.end = function () {
      this.raw.end()
    }
    request.res = reply
    done()
  })

  fastify.addHook('onResponse', (request, reply, done) => {
    const username = request.user?.username ?? 'Guest'
    const ip = request.headers['cf-connecting-ip'] || request.ip

    logger.log(
      `[${username}] ${request.method} ${request.url} ${reply.statusCode} - ${ip} ${now() - reply.startTime}ms`,
    )

    done()
  })
}
