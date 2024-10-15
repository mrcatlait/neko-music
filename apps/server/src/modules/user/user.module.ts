import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserAccountEntity, UserLoginDataEntity } from './entities'
import { UserAccountService, UserLoginDataService } from './services'

@Module({
  imports: [TypeOrmModule.forFeature([UserAccountEntity, UserLoginDataEntity])],
  providers: [UserAccountService, UserLoginDataService],
  controllers: [],
  exports: [UserAccountService, UserLoginDataService],
})
export class UserModule {}
