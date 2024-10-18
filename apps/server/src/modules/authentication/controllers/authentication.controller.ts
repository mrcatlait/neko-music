import { Body, Controller, Get, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { getPermissionId, Permission } from '@neko/permissions'

import { UserLoginDto, UserAccountDto } from '../dto'
import { AuthenticationService } from '../services'
import { User } from '../decorators'

import { UserModel } from '@modules/authorization/models'

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
    type: UserAccountDto,
  })
  @Post('login')
  async login(@Req() req: FastifyRequest, @Body() input: UserLoginDto): Promise<UserAccountDto> {
    const user = await this.authenticationService.validateUser(input)

    if (!user) {
      throw new UnauthorizedException()
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      permissions: user.role.permissions?.map((permission) => getPermissionId(permission as Permission)) || [],
    }

    await req.session.save()

    return req.session.user
  }

  @Throttle({
    short: { limit: 2, ttl: 1000 },
    long: { limit: 5, ttl: 60000 },
  })
  @Post('logout')
  logout(@Req() req: FastifyRequest): Promise<void> {
    return req.session.destroy()
  }

  @Get('me')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: UserAccountDto,
  })
  me(@Res({ passthrough: true }) res: FastifyReply, @User() user?: UserModel): UserAccountDto {
    res.header('Cache-Control', 'no-store')

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
