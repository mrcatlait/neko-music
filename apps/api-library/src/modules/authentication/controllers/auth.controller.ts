import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { ApiCookieAuth } from '@nestjs/swagger'
import { CommandBus } from '@nestjs/cqrs'

import { Session } from '../decorators'
import { AuthGuard } from '../guards'
import { RegisterDto, LoginDto } from '../dtos'
import { UserSession } from '../interfaces'
import { LoginCommand, RegisterUserCommand } from '../commands'
import { WhoamiQuery } from '../queries'

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: FastifyRequest): Promise<UserSession> {
    const userLoginData = await this.commandBus.execute(new LoginCommand(body.email, body.password))
    const session = await this.commandBus.execute(new WhoamiQuery(userLoginData.user_id))

    req.session.set('data', session)
    await req.session.save()

    return session
  }

  @Post('register')
  register(@Body() body: RegisterDto): Promise<void> {
    return this.commandBus.execute(new RegisterUserCommand(body.email, body.password, body.displayName))
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
