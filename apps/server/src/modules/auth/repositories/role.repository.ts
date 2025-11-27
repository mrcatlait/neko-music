import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'

import { Database, InjectDatabase, RoleTable } from '@/modules/database'

/**
 * Repository for Role entity operations
 */
@Injectable()
export class RoleRepository {
  private readonly table = 'auth.Role' as const

  constructor(@InjectDatabase() private readonly database: Database) {}

  save(data: Insertable<RoleTable>) {
    return this.database.insertInto(this.table).values(data).returningAll().executeTakeFirstOrThrow()
  }

  insert(data: Insertable<RoleTable>[]) {
    return this.database.insertInto(this.table).values(data).returningAll().execute()
  }

  find() {
    return this.database.selectFrom(this.table).selectAll().execute()
  }

  findBy(criteria: Partial<Selectable<RoleTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .execute()
  }

  findOneBy(criteria: Partial<Selectable<RoleTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .executeTakeFirst()
  }

  findOneByOrFail(criteria: Partial<Selectable<RoleTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .executeTakeFirstOrThrow()
  }

  update(criteria: Partial<Selectable<RoleTable>>, data: Updateable<RoleTable>) {
    return this.database
      .updateTable(this.table)
      .set(data)
      .where((eb) => eb.and(criteria))
      .returningAll()
      .execute()
  }

  delete(criteria: Partial<Selectable<RoleTable>>) {
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

  async countBy(criteria: Partial<Selectable<RoleTable>>) {
    const result = await this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst()

    return Number(result?.count ?? 0)
  }

  async existsBy(criteria: Partial<Selectable<RoleTable>>) {
    const count = await this.countBy(criteria)
    return count > 0
  }

  /**
   * Find the default role
   */
  findDefaultRole() {
    return this.findOneBy({ default: true })
  }
}
