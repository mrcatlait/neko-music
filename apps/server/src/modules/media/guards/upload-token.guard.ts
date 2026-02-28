import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { UploadTokenService } from '../services'
import { UploadTokenRepository } from '../repositories'

@Injectable()
export class UploadTokenGuard implements CanActivate {
  constructor(
    private readonly uploadTokenService: UploadTokenService,
    private readonly uploadTokenRepository: UploadTokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>()

    const uploadToken = this.uploadTokenService.extractUploadTokenFromHeader(req)

    if (!uploadToken) {
      throw new UnauthorizedException()
    }

    const token = await this.uploadTokenRepository.findById(uploadToken)

    if (!token) {
      throw new UnauthorizedException()
    }

    if (new Date() < token.expiresAt) {
      throw new UnauthorizedException()
    }

    const user = req.user

    if (!user) {
      throw new UnauthorizedException()
    }

    if (token.userId !== user.id) {
      throw new UnauthorizedException()
    }

    return true
  }
}
