import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'

import { Database, InjectDatabase, UserCredentialsTable } from '@/modules/database'

/**
 * Repository for UserCredentials entity operations
 * Note: Uses userId as the primary key instead of id
 */
@Injectable()
export class UserCredentialsRepository {
  private readonly table = 'auth.UserCredentials' as const

  constructor(@InjectDatabase() private readonly database: Database) {}

  save(data: Insertable<UserCredentialsTable>) {
    return this.database.insertInto(this.table).values(data).returningAll().executeTakeFirstOrThrow()
  }

  insert(data: Insertable<UserCredentialsTable>[]) {
    return this.database.insertInto(this.table).values(data).returningAll().execute()
  }

  find() {
    return this.database.selectFrom(this.table).selectAll().execute()
  }

  findBy(criteria: Partial<Selectable<UserCredentialsTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .execute()
  }

  findOneBy(criteria: Partial<Selectable<UserCredentialsTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .executeTakeFirst()
  }

  findOneByOrFail(criteria: Partial<Selectable<UserCredentialsTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .executeTakeFirstOrThrow()
  }

  update(criteria: Partial<Selectable<UserCredentialsTable>>, data: Updateable<UserCredentialsTable>) {
    return this.database
      .updateTable(this.table)
      .set(data)
      .where((eb) => eb.and(criteria))
      .returningAll()
      .execute()
  }

  delete(criteria: Partial<Selectable<UserCredentialsTable>>) {
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

  async countBy(criteria: Partial<Selectable<UserCredentialsTable>>) {
    const result = await this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst()

    return Number(result?.count ?? 0)
  }

  async existsBy(criteria: Partial<Selectable<UserCredentialsTable>>) {
    const count = await this.countBy(criteria)
    return count > 0
  }
}
