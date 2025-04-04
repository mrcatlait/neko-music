import { Injectable } from '@nestjs/common'

import { UserAccountEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class UserAccountRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  getById(id: string): Promise<UserAccountEntity | undefined> {
    return this.databaseService.sql<UserAccountEntity[]>`
      SELECT *
      FROM "user"."UserAccount" WHERE "user_id" = ${id}
    `.then((result) => result.at(0))
  }

  create(account: UserAccountEntity): Promise<UserAccountEntity> {
    return this.databaseService.sql<UserAccountEntity[]>`
      INSERT INTO "user"."UserAccount" ("user_id", "display_name")
      VALUES (${account.user_id}, ${account.display_name})
      RETURNING *
    `.then((result) => result[0])
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "user"."UserAccount" WHERE "user_id" = ${id}
    `.then(() => undefined)
  }
}
