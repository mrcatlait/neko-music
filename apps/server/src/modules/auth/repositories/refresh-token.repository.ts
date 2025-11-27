import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'

import { Database, InjectDatabase, RefreshTokenTable } from '@/modules/database'

/**
 * Repository for RefreshToken entity operations
 */
@Injectable()
export class RefreshTokenRepository {
  private readonly table = 'auth.RefreshToken' as const

  constructor(@InjectDatabase() private readonly database: Database) {}

  save(data: Insertable<RefreshTokenTable>) {
    return this.database.insertInto(this.table).values(data).returningAll().executeTakeFirstOrThrow()
  }

  insert(data: Insertable<RefreshTokenTable>[]) {
    return this.database.insertInto(this.table).values(data).returningAll().execute()
  }

  find() {
    return this.database.selectFrom(this.table).selectAll().execute()
  }

  findBy(criteria: Partial<Selectable<RefreshTokenTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .execute()
  }

  findOneBy(criteria: Partial<Selectable<RefreshTokenTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .executeTakeFirst()
  }

  findOneByOrFail(criteria: Partial<Selectable<RefreshTokenTable>>) {
    return this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .selectAll()
      .executeTakeFirstOrThrow()
  }

  update(criteria: Partial<Selectable<RefreshTokenTable>>, data: Updateable<RefreshTokenTable>) {
    return this.database
      .updateTable(this.table)
      .set(data)
      .where((eb) => eb.and(criteria))
      .returningAll()
      .execute()
  }

  delete(criteria: Partial<Selectable<RefreshTokenTable>>) {
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

  async countBy(criteria: Partial<Selectable<RefreshTokenTable>>) {
    const result = await this.database
      .selectFrom(this.table)
      .where((eb) => eb.and(criteria))
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst()

    return Number(result?.count ?? 0)
  }

  async existsBy(criteria: Partial<Selectable<RefreshTokenTable>>) {
    const count = await this.countBy(criteria)
    return count > 0
  }

  /**
   * Find a refresh token by token value
   */
  findByToken(token: string) {
    return this.findOneBy({ token })
  }

  /**
   * Delete a refresh token by token value
   */
  deleteByToken(token: string) {
    return this.delete({ token })
  }

  /**
   * Delete all expired refresh tokens
   */
  deleteExpired() {
    return this.database
      .deleteFrom(this.table)
      .where('expiresAt', '<', new Date())
      .execute()
      .then(() => undefined)
  }

  /**
   * Delete all refresh tokens for a specific user
   */
  deleteByUserId(userId: string) {
    return this.delete({ userId })
  }
}
