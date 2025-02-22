import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { UploadTokenRepository } from '../repositories'
import { UPLOAD_TOKEN_HEADER } from '../constants'

import { UserSession } from '@modules/authentication/interfaces'

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
      console.log('No token')
      throw new UnauthorizedException()
    }

    if (token.expires_at < new Date()) {
      console.log('Token expired')
      throw new UnauthorizedException()
    }

    const session = req.session.get('data') as UserSession

    if (token.user_id !== session.userId) {
      console.log('Token does not belong to the user')
      throw new UnauthorizedException()
    }

    return true
  }
}
