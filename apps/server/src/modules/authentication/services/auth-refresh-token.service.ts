import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RefreshTokenEntity } from '../entities'

import { UserAccountEntity } from 'src/modules/user/entities'
import { ConfigService } from '@shared/services'

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshTokenEntity)
    private readonly authRefreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async generateRefreshToken(authUserId: string) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUserId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      },
    )

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

    await this.authRefreshTokenRepository.insert({
      refreshToken: newRefreshToken,
      expiresAt,
      userId: authUserId,
    })

    return newRefreshToken
  }

  async validateRefreshToken(refreshToken: string, userId: string) {
    const token = await this.authRefreshTokenRepository.findOne({
      where: { refreshToken, userId },
    })

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token.')
    }

    await this.authRefreshTokenRepository.remove(token)
    return true
  }

  async generateTokenPair(user: UserAccountEntity) {
    const payload = { email: user.userLoginData.email, sub: user.id }

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(user.id),
    }
  }
}
