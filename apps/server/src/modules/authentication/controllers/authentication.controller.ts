import { Body, Controller, Get, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'

import { UserLoginDto, LoginPayloadDto, UserRegisterDto } from '../dto'
import { AuthenticationService } from '../services'
import { Public } from '../decorators'

import { UserModel } from '@modules/authorization/models'
import { User } from '@modules/authorization/decorators'

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @ApiBody({ type: UserLoginDto })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LoginPayloadDto,
  })
  @Public()
  @Post('login')
  async login(@Req() req: FastifyRequest, @Body() input: UserLoginDto): Promise<LoginPayloadDto> {
    const user = await this.authenticationService.validateUser(input)

    if (!user) {
      throw new UnauthorizedException()
    }

    const dto = new LoginPayloadDto(user)

    req.session.set('data', dto)

    await req.session.save()

    return dto
  }

  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @Post('logout')
  logout(@Req() req: FastifyRequest): Promise<void> {
    return req.session.destroy()
  }

  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @Get('whoami')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LoginPayloadDto,
  })
  async whoami(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
    @User() user: UserModel,
  ): Promise<LoginPayloadDto> {
    res.header('Cache-Control', 'no-store')
    await req.session.regenerate(['data'])
    await req.session.save()

    return user
  }

  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @Post('/register')
  @Public()
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LoginPayloadDto,
  })
  async register(@Req() req: FastifyRequest, @Body() input: UserRegisterDto): Promise<LoginPayloadDto> {
    const dto = await this.authenticationService.register(input)

    req.session.set('data', dto)

    await req.session.save()

    return dto
  }
}
