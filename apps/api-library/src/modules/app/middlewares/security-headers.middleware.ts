import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply & { setHeader: (key: string, value: string) => void }, next: () => void) {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '0')
    res.setHeader('Referrer-Policy', 'no-referrer')
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    res.setHeader(
      'Permissions-Policy',
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()', // Added more restricted features
    )
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';", // Enhanced CSP with more detailed directives
    )
    next()
  }
}
