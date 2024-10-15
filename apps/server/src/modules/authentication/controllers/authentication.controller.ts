import { Controller, HttpStatus, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'

import { REFRESH_TOKEN_COOKIE } from '../constants'
import { UserLoginDto, TokenPayloadDto } from '../dto'
import { LocalAuthGuard, JwtRefreshAuthGuard } from '../guards'
import { AuthenticationService, AuthRefreshTokenService } from '../services'

import { ConfigService } from '@shared/services'
import { NODE_ENV } from '@common/constants'

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @ApiBody({ type: UserLoginDto })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: TokenPayloadDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: FastifyRequest, @Res() res: FastifyReply): Promise<TokenPayloadDto> {
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
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: TokenPayloadDto,
  })
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: FastifyRequest, @Res() res: FastifyReply): Promise<TokenPayloadDto> {
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
      secure: this.configService.get('NODE_ENV') === NODE_ENV.PRODUCTION,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
  }
}
