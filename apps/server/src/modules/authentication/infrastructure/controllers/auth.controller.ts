import { Body, Controller, Get, Header, Post, Req } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { User } from '../decorators'

import { LoginHandler } from '@modules/authentication/login/commands'
import { RegisterHandler } from '@modules/authentication/registration/commands'
import { RegisterDto, LoginDto, AuthResponseDto } from '@modules/authentication/shared/dtos'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginHandler: LoginHandler,
    private readonly registerHandler: RegisterHandler,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: FastifyRequest): Promise<AuthResponseDto> {
    const userLoginData = await this.loginHandler.handle(body)

    req.session.set('data', userLoginData)
    await req.session.save()

    console.log(req.session.data)

    return userLoginData
  }

  @Post('register')
  register(@Body() body: RegisterDto): Promise<void> {
    return this.registerHandler.handle(body)
  }

  @Post('logout')
  logout(@Req() req: FastifyRequest): Promise<void> {
    return req.session.destroy()
  }

  @Get('whoami')
  @Header('Cache-Control', 'no-store')
  whoami(@User() user: any): any {
    console.log(user)
    return { accessToken: '123' }
  }
}
