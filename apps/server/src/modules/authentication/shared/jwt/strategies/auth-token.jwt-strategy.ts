import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

import { BaseJwtStrategy } from '../base-jwt.strategy'

import { EnvironmentVariables } from '@modules/shared/models'

@Injectable()
export class AuthTokenJwtStrategy extends BaseJwtStrategy {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {
    super({
      secret: configService.get('JWT_SECRET'),
      expiresIn: configService.get('JWT_TOKEN_EXPIRATION_TIME'),
      issuer: configService.get('JWT_ISSUER'),
      audience: configService.get('JWT_AUDIENCE'),
    })

    this.configService = configService
  }
}
