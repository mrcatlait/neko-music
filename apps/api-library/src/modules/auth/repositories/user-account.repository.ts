import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { UserAccountEntity, WithCredentials } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class UserAccountRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends UserAccountEntity>(user: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "auth"."UserAccount" (emailAddress, roleId, verified)
      VALUES (${user.emailAddress}, ${user.roleId}, ${user.verified})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(users: Omit<UserAccountEntity, 'id'>[], sql?: Sql): Promise<UserAccountEntity[]> {
    return (sql ?? this.databaseService.sql)<UserAccountEntity[]>`
      INSERT INTO "auth"."UserAccount" ${this.databaseService.sql(users)}
      RETURNING *
    `
  }

  update<Type extends UserAccountEntity>(user: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      UPDATE "auth"."UserAccount"
      SET emailAddress = ${user.emailAddress}, roleId = ${user.roleId}, verified = ${user.verified}
      WHERE id = ${user.id}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  updateMany(users: UserAccountEntity[], sql?: Sql): Promise<UserAccountEntity[]> {
    return (sql ?? this.databaseService.sql)<UserAccountEntity[]>`
      UPDATE "auth"."UserAccount"
      SET ${this.databaseService.sql(users)}
      RETURNING *
    `
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "auth"."UserAccount" WHERE id = ${id}
    `.then(() => undefined)
  }

  deleteMany(ids: string[]): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "auth"."UserAccount" WHERE id IN (${this.databaseService.sql(ids)})
    `.then(() => undefined)
  }

  findOneByEmail(email: string): Promise<WithCredentials<UserAccountEntity> | undefined> {
    return this.databaseService.sql<WithCredentials<UserAccountEntity>[]>`
      SELECT 
        ua.*,
        uc.passwordHash,
        uc.passwordSalt
      FROM "auth"."UserAccount" ua
        INNER JOIN "auth"."UserCredentials" uc ON ua.id = uc.userId
      WHERE ua.emailAddress = ${email}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "auth"."UserAccount" WHERE emailAddress = ${email})
    `.then((result) => result.at(0)?.exists ?? false)
  }
}
