import { Injectable } from '@nestjs/common'

import { WhoamiQuery } from './whoami.query'

import { Handler } from '@modules/shared/models'
import { UserSession } from '@modules/authentication/shared/interfaces'
import { GetPermissionsHandler } from '@modules/authorization/permissions/queries'
import { GetAccountHandler } from '@modules/user/account/queries'

@Injectable()
export class WhoamiHandler implements Handler<WhoamiQuery, UserSession> {
  constructor(
    private readonly getAccountHandler: GetAccountHandler,
    private readonly getPermissionsHandler: GetPermissionsHandler,
  ) {}

  async handle(query: WhoamiQuery): Promise<UserSession> {
    const [userAccount, permissions] = await Promise.all([
      this.getAccountHandler.handle({ userId: query.userId }),
      this.getPermissionsHandler.handle({ userId: query.userId }),
    ])

    return {
      userId: query.userId,
      displayName: userAccount.display_name,
      permissions,
    }
  }
}
