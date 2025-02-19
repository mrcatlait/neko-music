import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { Session } from '../decorators'
import { AuthGuard } from '../guards'

import { LoginHandler } from '@modules/authentication/login/commands'
import { RegisterHandler } from '@modules/authentication/registration/commands'
import { RegisterDto, LoginDto } from '@modules/authentication/shared/dtos'
import { WhoamiHandler } from '@modules/authentication/whoami/queries'
import { UserSession } from '@modules/authentication/shared/interfaces'
import { ApiCookieAuth } from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginHandler: LoginHandler,
    private readonly registerHandler: RegisterHandler,
    private readonly whoamiHandler: WhoamiHandler,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: FastifyRequest): Promise<UserSession> {
    const userLoginData = await this.loginHandler.handle(body)
    const session = await this.whoamiHandler.handle({ userId: userLoginData.user_id })

    req.session.set('data', session)
    await req.session.save()

    return session
  }

  @Post('register')
  register(@Body() body: RegisterDto): Promise<void> {
    return this.registerHandler.handle(body)
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  logout(@Req() req: FastifyRequest): Promise<void> {
    return req.session.destroy()
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  whoami(@Session() session: UserSession): UserSession {
    return session
  }
}
