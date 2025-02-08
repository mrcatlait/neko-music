import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { JwtRefreshAuthGuard } from '../guards'

import { LoginHandler } from '@modules/authentication/login/commands'
import { RegisterHandler } from '@modules/authentication/registration/commands'
import { RefreshTokenHandler } from '@modules/authentication/token/commands'
import { RegisterDto, LoginDto, AuthResponseDto } from '@modules/authentication/shared/dtos'
import { REFRESH_TOKEN_COOKIE_NAME } from '@modules/authentication/shared/constants'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginHandler: LoginHandler,
    private readonly registerHandler: RegisterHandler,
    private readonly refreshTokenHandler: RefreshTokenHandler,
  ) {}

  @Post('login')
  login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    return this.loginHandler.handle(body)
  }

  @Post('register')
  register(@Body() body: RegisterDto): Promise<AuthResponseDto> {
    return this.registerHandler.handle(body).then(({ accessToken }) => ({ accessToken }))
  }

  @Post('logout')
  logout() {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  refresh(@Req() request: FastifyRequest) {
    const token = request.cookies[REFRESH_TOKEN_COOKIE_NAME]!
    return this.refreshTokenHandler.handle({ token, jwtPayload: request.payload })
  }
}
