import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'

import { Database, InjectDatabase, UserAccountTable } from '@/modules/database'

/**
 * Type for user account with credentials
 */
export type UserAccountWithCredentials = Selectable<UserAccountTable> & {
  passwordHash: string
  passwordSalt: string
}

/**
 * Repository for UserAccount entity operations
 */
@Injectable()
export class UserAccountRepository {
  private readonly table = 'auth.UserAccount' as const

  constructor(@InjectDatabase() private readonly database: Database) {}

  save(data: Insertable<UserAccountTable>) {
    return this.database.insertInto(this.table).values(data).returningAll().executeTakeFirstOrThrow()
  }

  insert(data: Insertable<UserAccountTable>[]) {
    return this.database.insertInto(this.table).values(data).returningAll().execute()
  }

  find() {
    return this.database.selectFrom(this.table).selectAll().execute()
  }

  findBy(criteria: Partial<Selectable<UserAccountTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .execute()
  }

  findOneBy(criteria: Partial<Selectable<UserAccountTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .executeTakeFirst()
  }

  findOneByOrFail(criteria: Partial<Selectable<UserAccountTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .executeTakeFirstOrThrow()
  }

  update(criteria: Partial<Selectable<UserAccountTable>>, data: Updateable<UserAccountTable>) {
    return this.database
      .updateTable(this.table)
      .set(data)
      .where((eb) => eb.and(criteria))
      .returningAll()
      .execute()
  }

  delete(criteria: Partial<Selectable<UserAccountTable>>) {
    return this.database
      .deleteFrom(this.table)
      .where((eb) => eb.and(criteria))
      .execute()
      .then(() => undefined)
  }

  async count() {
    const result = await this.database
      .selectFrom(this.table)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst()

    return Number(result?.count ?? 0)
  }

  async countBy(criteria: Partial<Selectable<UserAccountTable>>) {
    const result = await this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst()

    return Number(result?.count ?? 0)
  }

  async existsBy(criteria: Partial<Selectable<UserAccountTable>>) {
    const count = await this.countBy(criteria)
    return count > 0
  }

  /**
   * Find one user account by ID (alias for findOneBy)
   */
  findOne(id: string) {
    return this.findOneBy({ id })
  }

  /**
   * Find a user account by email with credentials (JOIN query)
   */
  findOneByEmail(email: string): Promise<UserAccountWithCredentials | undefined> {
    return this.database
      .selectFrom(this.table)
      .innerJoin('auth.UserCredentials', 'auth.UserCredentials.userId', 'auth.UserAccount.id')
      .where('auth.UserAccount.emailAddress', '=', email)
      .select([
        'auth.UserAccount.id',
        'auth.UserAccount.emailAddress',
        'auth.UserAccount.roleId',
        'auth.UserAccount.verified',
        'auth.UserCredentials.passwordHash',
        'auth.UserCredentials.passwordSalt',
      ])
      .executeTakeFirst()
  }

  /**
   * Check if a user account exists with the given email
   */
  existsByEmail(email: string) {
    return this.existsBy({ emailAddress: email })
  }
}
