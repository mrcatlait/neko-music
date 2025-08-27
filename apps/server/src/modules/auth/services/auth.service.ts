import { Inject, Injectable } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'

import { AuthModuleOptions } from '../types'
import { AUTH_MODULE_OPTIONS } from '../tokens'
import { ACCESS_TOKEN_HEADER_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../constants'
import { AccessTokenPayload, JwtService } from './jwt.service'
import { RefreshTokenRepository } from '../repositories'
import { User } from '../interfaces'

@Injectable()
export class AuthService {
  private readonly accessTokenHeaderName: string
  private readonly refreshTokenCookieName: string
  private readonly refreshTokenExpiresIn: number

  constructor(
    @Inject(AUTH_MODULE_OPTIONS) private readonly options: AuthModuleOptions,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    this.accessTokenHeaderName = options.accessTokenHeaderName ?? ACCESS_TOKEN_HEADER_NAME
    this.refreshTokenCookieName = options.refreshTokenCookieName ?? REFRESH_TOKEN_COOKIE_NAME
    this.refreshTokenExpiresIn = options.refreshTokenExpiresIn
  }

  extractAccessTokenFromHeader(request: FastifyRequest): string | undefined {
    const header = request.headers[this.accessTokenHeaderName]

    if (typeof header !== 'string') {
      return undefined
    }

    const [type, token] = header.split(' ')
    return type === 'Bearer' ? token : undefined
  }

  extractRefreshTokenFromCookie(request: FastifyRequest): string | undefined {
    const token = request.cookies[this.refreshTokenCookieName]

    if (!token) {
      return undefined
    }

    return token
  }

  injectRefreshTokenToCookie(response: FastifyReply, token: string) {
    response.setCookie(this.refreshTokenCookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: this.refreshTokenExpiresIn,
    })
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const { token, expiresAt } = await this.jwtService.signRefreshToken({
      userId,
    })

    await this.refreshTokenRepository.create({
      userId,
      token,
      expiresAt,
    })

    return token
  }

  generateTokenPair(payload: AccessTokenPayload): Promise<{ accessToken: string; refreshToken: string }> {
    return Promise.all([this.jwtService.signAccessToken(payload), this.generateRefreshToken(payload.userId)]).then(
      ([accessToken, refreshToken]) => ({ accessToken, refreshToken }),
    )
  }

  logout(response: FastifyReply, user: User): Promise<void> {
    response.clearCookie(this.refreshTokenCookieName)
    return this.refreshTokenRepository.deleteByUserId(user.id)
  }
}
