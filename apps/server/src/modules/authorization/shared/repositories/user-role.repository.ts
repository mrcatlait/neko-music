import { Injectable } from '@nestjs/common'

import { DatabaseService } from '@modules/database'

@Injectable()
export class UserRoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  existsByUserIdAndRoleId(userId: string, roleId: string): Promise<boolean> {
    return this.databaseService.sql`
      SELECT 1
      FROM "UserRole"
      WHERE "user_id" = ${userId} AND "role_id" = ${roleId}
    `.then((result) => result.length > 0)
  }

  create(userId: string, roleId: string): Promise<{ user_id: string }> {
    return this.databaseService.sql<{ user_id: string }[]>`
      INSERT INTO "UserRole" ("user_id", "role_id")
      VALUES (${userId}, ${roleId})
      RETURNING *
    `.then((result) => result[0])
  }
}
