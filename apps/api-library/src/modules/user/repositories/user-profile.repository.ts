import { Injectable } from '@nestjs/common'

import { UserProfileEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class UserProfileRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findOne(id: string): Promise<UserProfileEntity | undefined> {
    return this.databaseService.sql<UserProfileEntity[]>`
      SELECT *
      FROM "user"."UserProfile" WHERE "userId" = ${id}
    `.then((result) => result.at(0))
  }

  create(profile: UserProfileEntity): Promise<UserProfileEntity> {
    return this.databaseService.sql<UserProfileEntity[]>`
      INSERT INTO "user"."UserProfile" ("userId", "displayName")
      VALUES (${profile.userId}, ${profile.displayName})
      RETURNING *
    `.then((result) => result[0])
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "user"."UserProfile" WHERE "userId" = ${id}
    `.then(() => undefined)
  }
}
