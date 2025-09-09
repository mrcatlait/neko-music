import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { RegistrationRequest, LoginResponse, LoginRequest, RefreshTokenResponse } from '../dtos'
import { GetUserUseCase, LoginUseCase, RefreshTokenUseCase, RegisterUserUseCase } from '../use-cases'
import { Public, UserSession } from '../decorators'
import { AuthService } from '../services'
import { User } from '../interfaces'
import { WhoamiResponse } from '../dtos/whoami-response.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Login a user',
  })
  @ApiOkResponse({
    type: LoginResponse,
  })
  async login(@Body() body: LoginRequest, @Res({ passthrough: true }) response: FastifyReply): Promise<LoginResponse> {
    const session = await this.loginUseCase.invoke({
      email: body.email,
      password: body.password,
    })

    this.authService.injectRefreshTokenToCookie(response, session.refreshToken)

    return {
      accessToken: session.accessToken,
      email: session.email,
      displayName: session.displayName,
      permissions: session.permissions,
    }
  }

  @Post('register')
  @Public()
  @ApiOperation({
    summary: 'Register a user',
  })
  @ApiOkResponse({
    type: LoginResponse,
  })
  async register(
    @Body() body: RegistrationRequest,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<LoginResponse> {
    const session = await this.registerUserUseCase.invoke({
      email: body.email,
      password: body.password,
      displayName: body.displayName,
    })

    this.authService.injectRefreshTokenToCookie(response, session.refreshToken)

    return {
      accessToken: session.accessToken,
      email: session.email,
      displayName: session.displayName,
      permissions: session.permissions,
    }
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout a user',
  })
  logout(@Res() response: FastifyReply, @UserSession() user: User): Promise<void> {
    return this.authService.logout(response, user)
  }

  @Get('refresh')
  @Public()
  @ApiOperation({
    summary: 'Refresh a user',
  })
  @ApiOkResponse({
    type: RefreshTokenResponse,
  })
  async refresh(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<RefreshTokenResponse> {
    const token = this.authService.extractRefreshTokenFromCookie(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    const tokenPair = await this.refreshTokenUseCase.invoke({ token })

    this.authService.injectRefreshTokenToCookie(response, tokenPair.refreshToken)

    return {
      accessToken: tokenPair.accessToken,
    }
  }

  @Get('whoami')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the current user',
  })
  @ApiOkResponse({
    type: WhoamiResponse,
  })
  whoami(@UserSession() user: User): Promise<WhoamiResponse> {
    return this.getUserUseCase.invoke({ userId: user.id })
  }
}
