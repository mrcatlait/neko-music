import { BaseJwtStrategy } from '../base-jwt.strategy'

import { Container } from '@common/di'
import { ConfigService } from '@common/config'

export class RefreshTokenJwtStrategy extends BaseJwtStrategy {
  private readonly configService: ConfigService

  constructor() {
    const configService = Container.get(ConfigService)

    super({
      secret: configService.get('JWT_REFRESH_SECRET'),
      expiresIn: configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      issuer: configService.get('JWT_ISSUER'),
      audience: configService.get('JWT_AUDIENCE'),
    })

    this.configService = configService
  }
}
