import { RefreshTokenEntity } from '../entities'

import { Container } from '@common/di'
import { DatabaseService } from '@common/database'

export class RefreshTokenRepository {
  private readonly databaseService: DatabaseService

  constructor() {
    this.databaseService = Container.get(DatabaseService)
  }

  insert(refreshToken: Omit<RefreshTokenEntity, 'id'>) {
    return this.databaseService.sql`
      INSERT INTO "RefreshToken" (
        "refresh_token",
        "expires_at",
        "user_id"
      ) VALUES (
        ${refreshToken.refresh_token},
        ${refreshToken.expires_at},
        ${refreshToken.user_id}
      )
    `
  }

  findOneByToken(refreshToken: string): Promise<RefreshTokenEntity | null> {
    return this.databaseService.sql<RefreshTokenEntity[]>`
      SELECT * FROM "RefreshToken"
      WHERE "refresh_token" = ${refreshToken}
      AND "expires_at" > NOW()
      LIMIT 1
    `.then((result) => result.at(0) ?? null)
  }

  delete(id: string) {
    return this.databaseService.sql`
      DELETE FROM "RefreshToken"
      WHERE "id" = ${id}
    `
  }
}
