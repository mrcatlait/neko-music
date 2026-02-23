import { Inject, Injectable } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'

import { AuthModuleOptions } from '../types'
import { AUTH_MODULE_OPTIONS } from '../tokens'
import { ACCESS_TOKEN_HEADER_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../constants'
import { AccessTokenPayload, JwtService } from './jwt.service'
import { AuthRepository } from '../repositories'
import { User } from '../interfaces'

import { parseTimePeriod } from '@/modules/shared/utils'

@Injectable()
export class AuthService {
  private readonly accessTokenHeaderName = ACCESS_TOKEN_HEADER_NAME
  private readonly refreshTokenCookieName = REFRESH_TOKEN_COOKIE_NAME
  private readonly refreshTokenExpiresIn: string
  private readonly saltRounds: number

  constructor(
    @Inject(AUTH_MODULE_OPTIONS) private readonly options: AuthModuleOptions,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {
    this.refreshTokenExpiresIn = options.refreshTokenExpiresIn
    this.saltRounds = options.saltRounds
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
      path: '/',
      sameSite: 'strict',
      maxAge: parseTimePeriod(this.refreshTokenExpiresIn),
    })
  }

  generatePasswordSalt(): string {
    return genSaltSync(this.saltRounds)
  }

  generatePasswordHash(password: string, salt: string): string {
    return hashSync(password, salt)
  }

  comparePasswordHash(password: string, hash: string): boolean {
    return compareSync(password, hash)
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const { token, expiresAt } = await this.jwtService.signRefreshToken({
      userId,
    })

    await this.authRepository.createRefreshToken({
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
    return this.authRepository.deleteRefreshTokenByUserId(user.id)
  }
}
