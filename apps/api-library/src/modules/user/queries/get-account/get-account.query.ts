import { Query } from '@nestjs/cqrs'
import { UserAccountEntity } from '@modules/user/entities'

export class GetAccountQuery extends Query<UserAccountEntity> {
  constructor(readonly userId: string) {
    super()
  }
}
