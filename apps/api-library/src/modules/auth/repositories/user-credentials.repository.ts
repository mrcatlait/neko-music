import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { UserCredentialsEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class UserCredentialsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends UserCredentialsEntity>(user: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "auth"."UserCredentials" (userId, passwordHash, passwordSalt)
      VALUES (${user.userId}, ${user.passwordHash}, ${user.passwordSalt})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(users: UserCredentialsEntity[], sql?: Sql): Promise<UserCredentialsEntity[]> {
    return (sql ?? this.databaseService.sql)<UserCredentialsEntity[]>`
      INSERT INTO "auth"."UserCredentials" ${this.databaseService.sql(users)}
      RETURNING *
    `
  }

  update<Type extends UserCredentialsEntity>(user: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      UPDATE "auth"."UserCredentials"
      SET passwordHash = ${user.passwordHash}, passwordSalt = ${user.passwordSalt}
      WHERE userId = ${user.userId}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  updateMany(users: UserCredentialsEntity[], sql?: Sql): Promise<UserCredentialsEntity[]> {
    return (sql ?? this.databaseService.sql)<UserCredentialsEntity[]>`
      UPDATE "auth"."UserCredentials"
      SET ${this.databaseService.sql(users)}
      RETURNING *
    `
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "auth"."UserCredentials" WHERE userId = ${id}
    `.then(() => undefined)
  }

  deleteMany(ids: string[]): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "auth"."UserCredentials" WHERE userId IN (${this.databaseService.sql(ids)})
    `.then(() => undefined)
  }
}
