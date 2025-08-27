import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { RefreshTokenEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends RefreshTokenEntity>(refreshToken: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO auth."RefreshToken" ("userId", "token", "expiresAt")
      VALUES (${refreshToken.userId}, ${refreshToken.token}, ${refreshToken.expiresAt})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  findOneByUserId(userId: string): Promise<RefreshTokenEntity | undefined> {
    return this.databaseService.sql<RefreshTokenEntity[]>`
      SELECT * FROM auth."RefreshToken" WHERE "userId" = ${userId}
    `.then((result) => result.at(0))
  }

  findOneByToken(token: string): Promise<RefreshTokenEntity | undefined> {
    return this.databaseService.sql<RefreshTokenEntity[]>`
      SELECT * FROM auth."RefreshToken" WHERE "token" = ${token}
    `.then((result) => result.at(0))
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM auth."RefreshToken" WHERE id = ${id}
    `.then(() => undefined)
  }

  deleteExpired(): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM auth."RefreshToken" WHERE "expiresAt" < NOW()
    `.then(() => undefined)
  }

  deleteByUserId(userId: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM auth."RefreshToken" WHERE "userId" = ${userId}
    `.then(() => undefined)
  }
}
