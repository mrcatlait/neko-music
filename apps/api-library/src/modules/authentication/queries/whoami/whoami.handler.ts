import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs'

import { UserSession } from '../../interfaces'
import { WhoamiQuery } from './whoami.query'

import { GetAccountQuery } from '@modules/user/queries'
import { GetPermissionsQuery } from '@modules/authorization/queries'

@QueryHandler(WhoamiQuery)
export class WhoamiHandler implements IQueryHandler<WhoamiQuery> {
  constructor(private readonly queryBus: QueryBus) {}

  async execute(query: WhoamiQuery): Promise<UserSession> {
    const [userAccount, permissions] = await Promise.all([
      this.queryBus.execute(new GetAccountQuery(query.userId)),
      this.queryBus.execute(new GetPermissionsQuery(query.userId)),
    ])

    return {
      userId: query.userId,
      displayName: userAccount.display_name,
      permissions,
    }
  }
}
