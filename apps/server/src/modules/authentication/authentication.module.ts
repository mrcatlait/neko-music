import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '../user/user.module'
import { RefreshTokenEntity } from './entities'
import { AuthenticationService, AuthRefreshTokenService, CryptoService } from './services'
import { AuthenticationController } from './authentication.controller'
import { JwtRefreshStrategy, JwtStrategy, LocalStrategy } from './strategies'
import { RefreshTokenCron } from './crons'

import { ConfigService } from '@core/services/config.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
  ],
  providers: [
    AuthenticationService,
    AuthRefreshTokenService,
    CryptoService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    RefreshTokenCron,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
