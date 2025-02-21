import { Query } from '@nestjs/cqrs'

import { UserSession } from '../../interfaces'

export class WhoamiQuery extends Query<UserSession> {
  constructor(readonly userId: string) {
    super()
  }
}
