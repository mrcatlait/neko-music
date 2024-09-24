import { Module } from '@nestjs/common'

import { CoreModule } from './core/core.module'

import { AuthModule } from '@features/auth'
import { FeaturesModule } from '@features/features.module'

@Module({
  imports: [AuthModule, CoreModule, FeaturesModule],
})
export class AppModule {}
