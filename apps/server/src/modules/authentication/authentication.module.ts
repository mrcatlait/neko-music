import { Module } from '@nestjs/common'

import { AuthController } from './infrastructure/controllers'
import { LoginHandler, LoginValidator } from './login/commands'
import { RefreshTokenHandler, RefreshTokenValidator } from './token/commands'
import { RegisterHandler, RegisterValidator } from './registration/commands'
import { RefreshTokenRepository, UserLoginDataRepository } from './shared/repositories'
import { TokenService } from './shared/services'
import { AuthTokenJwtStrategy, RefreshTokenJwtStrategy } from './shared/jwt'
import { JwtRefreshAuthGuard } from './infrastructure/guards'

@Module({
  controllers: [AuthController],
  providers: [
    LoginHandler,
    LoginValidator,
    RegisterHandler,
    RegisterValidator,
    RefreshTokenHandler,
    RefreshTokenValidator,
    UserLoginDataRepository,
    RefreshTokenRepository,
    TokenService,
    AuthTokenJwtStrategy,
    RefreshTokenJwtStrategy,
    JwtRefreshAuthGuard,
  ],
})
export class AuthenticationModule {}
