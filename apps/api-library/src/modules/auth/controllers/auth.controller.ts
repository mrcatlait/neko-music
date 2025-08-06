import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { ApiCookieAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { Session } from '../decorators'
import { AuthGuard } from '../guards'
import { RegisterDto, LoginDto, UserSessionDto } from '../dtos'
import { UserSession } from '../interfaces'
import { LoginUseCase, RegisterUserUseCase } from '../use-cases'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
  })
  @ApiOkResponse({
    type: UserSessionDto,
  })
  async login(@Body() body: LoginDto, @Req() req: FastifyRequest): Promise<UserSession> {
    const session = await this.loginUseCase.invoke({
      email: body.email,
      password: body.password,
    })

    req.session.set('data', session)
    await req.session.save()

    return session
  }

  @Post('register')
  register(@Body() body: RegisterDto): Promise<void> {
    return this.registerUserUseCase.invoke({
      email: body.email,
      password: body.password,
      displayName: body.displayName,
    })
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
  @ApiOperation({
    summary: 'Get the current user',
  })
  @ApiOkResponse({
    type: UserSessionDto,
  })
  whoami(@Session() session: UserSession): UserSession {
    return session
  }
}
