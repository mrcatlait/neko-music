import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { APP_GUARD } from '@nestjs/core'

import { JwtStrategy } from './strategies'
import { JwtAuthGuard } from './guards'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [PassportModule],
})
export class AuthModule {}
