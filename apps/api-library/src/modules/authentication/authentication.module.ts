import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { LocalStrategy, JwtStrategy, JwtRefreshStrategy } from './strategies'

import { EnvironmentVariables } from '@modules/shared/models'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_TOKEN_EXPIRATION_TIME') },
      }),
    }),
  ],
  providers: [JwtStrategy, JwtRefreshStrategy, LocalStrategy],
  controllers: [],
  exports: [],
})
export class AuthenticationModule {}
