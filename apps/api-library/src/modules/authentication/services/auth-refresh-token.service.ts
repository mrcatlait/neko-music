import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { RefreshTokenRepository } from '../repositories'

import { EnvironmentVariables } from '@modules/shared/models'

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async generateRefreshToken(authUserId: string, currentRefreshToken?: string, currentRefreshTokenExpiresAt?: Date) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUserId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      },
    )

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      if (await this.isValidRefreshToken(currentRefreshToken, authUserId)) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      await this.refreshTokenRepository.insert({
        refresh_token: currentRefreshToken,
        expires_at: currentRefreshTokenExpiresAt,
        user_id: authUserId,
      })
    }

    return newRefreshToken
  }

  async isValidRefreshToken(refreshToken: string, userId: string): Promise<boolean> {
    const token = await this.refreshTokenRepository.findOne(refreshToken, userId)

    if (!token) {
      return false
    }

    await this.refreshTokenRepository.delete(token.id)
    return true
  }

  async generateTokenPair(user: User, currentRefreshToken?: string, currentRefreshTokenExpiresAt?: Date) {
    const payload = { email: user.email, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload), // jwt module is configured in auth.module.ts for access token
      refresh_token: await this.generateRefreshToken(user.id, currentRefreshToken, currentRefreshTokenExpiresAt),
    }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_6AM)
  // async clearExpiredRefreshTokens() {
  //   await this.authRefreshTokenRepository.delete({
  //     expiresAt: LessThanOrEqual(new Date()),
  //   })
  // }
}
