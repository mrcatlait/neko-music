import { Controller, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'

import { Public } from './decorators/public.decorator'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard'
import { AuthenticationService, AuthRefreshTokenService } from './services'
import { REFRESH_TOKEN_COOKIE } from './authentication.constant'

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @ApiBody({ type: UserLoginDto })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    if (!req.user) {
      throw new InternalServerErrorException()
    }

    const { accessToken, refreshToken } = await this.authenticationService.login(req.user)

    this.setRefreshTokenCookie(res, refreshToken)

    return { accessToken }
  }

  @Throttle({
    short: { limit: 1, ttl: 1000 },
    long: { limit: 2, ttl: 60000 },
  })
  @ApiBearerAuth()
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    if (!req.user) {
      throw new InternalServerErrorException()
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.authRefreshTokenService.generateTokenPair(
      req.user,
    )

    this.setRefreshTokenCookie(res, newRefreshToken)

    return { accessToken }
  }

  private setRefreshTokenCookie(res: FastifyReply, refreshToken: string): void {
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
  }
}
