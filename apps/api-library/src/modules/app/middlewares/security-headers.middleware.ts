import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;",
    )
    next()
  }
}
