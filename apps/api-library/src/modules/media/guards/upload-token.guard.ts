import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { UploadTokenRepository } from '../repositories'
import { UPLOAD_TOKEN_HEADER } from '../constants'

import { UserSession } from '@modules/auth/interfaces'

@Injectable()
export class UploadTokenGuard implements CanActivate {
  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>()

    const uploadToken = req.headers[UPLOAD_TOKEN_HEADER] as string | undefined

    if (!uploadToken) {
      throw new UnauthorizedException()
    }

    const token = await this.uploadTokenRepository.findOne(uploadToken)

    if (!token) {
      throw new UnauthorizedException()
    }

    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException()
    }

    const session = req.session.get('data') as UserSession | undefined

    if (!session) {
      throw new UnauthorizedException()
    }

    if (token.userId !== session.userId) {
      throw new UnauthorizedException()
    }

    return true
  }
}
