import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThanOrEqual, Repository } from 'typeorm'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'

import { AuthRefreshToken } from './entities/auth-refresh-token.entity'
import { User } from '../user/entities/user.entity'
import { EnvironmentVariables } from '../../config/env/configuration'

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    @InjectRepository(AuthRefreshToken)
    private readonly authRefreshTokenRepository: Repository<AuthRefreshToken>,
  ) {}

  async generateRefreshToken(authUserId: number, currentRefreshToken?: string, currentRefreshTokenExpiresAt?: Date) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUserId },
      {
        secret: this.configService.get('jwtRefreshSecret'),
        expiresIn: '30d',
      },
    )

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      if (await this.isRefreshTokenBlackListed(currentRefreshToken, authUserId)) {
        throw new UnauthorizedException('Invalid refresh token.')
      }

      await this.authRefreshTokenRepository.insert({
        refreshToken: currentRefreshToken,
        expiresAt: currentRefreshTokenExpiresAt,
        userId: authUserId,
      })
    }

    return newRefreshToken
  }

  async validateRefreshToken(refreshToken: string, userId: number) {
    const token = await this.authRefreshTokenRepository.findOne({
      where: {
        refreshToken,
        userId,
        isRevoked: false,
        expiresAt: MoreThanOrEqual(new Date()),
      },
    })

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    // Revoke the used token (implement token rotation)
    await this.authRefreshTokenRepository.delete({ id: token.id })

    return true
  }
  async generateTokenPair(user: User, currentRefreshToken?: string, currentRefreshTokenExpiresAt?: Date) {
    const payload = { email: user.email, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload), // jwt module is configured in auth.module.ts for access token
      refresh_token: await this.generateRefreshToken(user.id, currentRefreshToken, currentRefreshTokenExpiresAt),
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredRefreshTokens() {
    await this.authRefreshTokenRepository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    })
  }
}
