import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { ConfigService } from '@shared/services'

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name)

  private readonly moduleOptions = { strict: false }

  private configService: ConfigService

  constructor(private readonly moduleRef: ModuleRef) {}

  async onModuleInit(): Promise<void> {
    this.configService = this.moduleRef.get(ConfigService, this.moduleOptions)

    await this.initRootUser()
  }

  private async initRootUser(): Promise<void> {
    // const rootEmail = this.configService.get('BANK_ROOT_EMAIL')
    // const rootPassword = this.configService.get('BANK_ROOT_PASSWORD')

    // const isExistRootUser = await this.userService.getUser({
    //   email: rootEmail,
    // })

    // if (isExistRootUser) {
    //   return
    // }

    // const { uuid } = await this._currencyService.findCurrency({
    //   name: 'USD',
    // })

    // const { userAuth } = await this.userService.createUser({
    //   firstName: 'Bank',
    //   lastName: 'Application',
    //   email: rootEmail,
    //   password: rootPassword,
    //   currency: uuid,
    // })

    // await this._userAuthService.updateRole(userAuth, RoleType.ROOT)

    this.logger.log(`Root user have been initiated`)
  }
}
