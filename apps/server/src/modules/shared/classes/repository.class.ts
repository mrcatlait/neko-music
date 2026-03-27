import type { Kysely } from 'kysely'
import { Insertable, Selectable, Updateable } from 'kysely'

import { FindOptions } from '../types'

import { Database } from '@/modules/database'

/**
 * Loose schema so {@link Kysely} builders stay callable when the real DB type is generic.
 */
type LooseDbSchema = Record<string, Record<string, unknown>>

/**
 * Kysely CRUD base for a single table. Subclasses set {@link table} to the schema-qualified name
 * (e.g. `'backstage.Artist'`).
 * @example
 * ```typescript
 * class ArtistRepository extends Repository<BackstageSchema, 'backstage.Artist'> {
 *   constructor(@InjectDatabase() database: Database<BackstageSchema>) {
 *     super(database, 'backstage.Artist')
 *   }
 * }
 * ```
 */
export abstract class Repository<Schema, TableName extends keyof Schema & string> {
  constructor(
    protected readonly database: Database<Schema>,
    private readonly table: TableName,
  ) {}

  private get db(): Kysely<LooseDbSchema> {
    return this.database as unknown as Kysely<LooseDbSchema>
  }

  private get tableName(): string {
    return this.table as string
  }

  findOne(criteria: string | FindOptions<Schema[TableName]>): Promise<Selectable<Schema[TableName]> | undefined> {
    if (typeof criteria === 'string') {
      return this.db.selectFrom(this.tableName).selectAll().where('id', '=', criteria).executeTakeFirst() as Promise<
        Selectable<Schema[TableName]> | undefined
      >
    }

    return this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where((eb) => eb.and(criteria))
      .executeTakeFirst() as Promise<Selectable<Schema[TableName]> | undefined>
  }

  findMany(criteria: string | string[] | FindOptions<Schema[TableName]>): Promise<Selectable<Schema[TableName]>[]> {
    if (typeof criteria === 'string') {
      return this.db.selectFrom(this.tableName).selectAll().where('id', '=', criteria).execute() as Promise<
        Selectable<Schema[TableName]>[]
      >
    }

    if (Array.isArray(criteria)) {
      return this.db.selectFrom(this.tableName).selectAll().where('id', 'in', criteria).execute() as Promise<
        Selectable<Schema[TableName]>[]
      >
    }

    return this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where((eb) => eb.and(criteria))
      .execute() as Promise<Selectable<Schema[TableName]>[]>
  }

  create(data: Insertable<Schema[TableName]>): Promise<Selectable<Schema[TableName]>> {
    return this.db.insertInto(this.tableName).values(data).returningAll().executeTakeFirstOrThrow() as Promise<
      Selectable<Schema[TableName]>
    >
  }

  update(
    criteria: string | FindOptions<Schema[TableName]>,
    data: Updateable<Schema[TableName]>,
  ): Promise<Selectable<Schema[TableName]>> {
    if (typeof criteria === 'string') {
      return this.db
        .updateTable(this.tableName)
        .set(data as Record<string, unknown>)
        .where('id', '=', criteria)
        .returningAll()
        .executeTakeFirstOrThrow() as Promise<Selectable<Schema[TableName]>>
    }

    return this.db
      .updateTable(this.tableName)
      .set(data as Record<string, unknown>)
      .where((eb) => eb.and(criteria))
      .returningAll()
      .executeTakeFirstOrThrow() as Promise<Selectable<Schema[TableName]>>
  }

  delete(criteria: string | FindOptions<Schema[TableName]>): Promise<void> {
    if (typeof criteria === 'string') {
      return this.db
        .deleteFrom(this.tableName)
        .where('id', '=', criteria)
        .execute()
        .then(() => undefined)
    }

    return this.db
      .deleteFrom(this.tableName)
      .where((eb) => eb.and(criteria))
      .execute()
      .then(() => undefined)
  }

  exists(criteria: string | FindOptions<Schema[TableName]>): Promise<boolean> {
    if (typeof criteria === 'string') {
      return this.db
        .selectFrom(this.tableName)
        .select((eb) => eb.lit(true).as('exists'))
        .where('id', '=', criteria)
        .executeTakeFirst()
        .then(Boolean)
    }

    return this.db
      .selectFrom(this.tableName)
      .select((eb) => eb.lit(true).as('exists'))
      .where((eb) => eb.and(criteria))
      .executeTakeFirst()
      .then(Boolean)
  }

  count(criteria: string | string[] | FindOptions<Schema[TableName]>): Promise<number> {
    if (typeof criteria === 'string') {
      return this.db
        .selectFrom(this.tableName)
        .select((eb) => eb.fn.countAll().as('count'))
        .where('id', '=', criteria)
        .executeTakeFirst()
        .then((row) => Number(row?.count ?? 0))
    }

    if (Array.isArray(criteria)) {
      return this.db
        .selectFrom(this.tableName)
        .select((eb) => eb.fn.countAll().as('count'))
        .where('id', 'in', criteria)
        .executeTakeFirst()
        .then((row) => Number(row?.count ?? 0))
    }

    return this.db
      .selectFrom(this.tableName)
      .select((eb) => eb.fn.countAll().as('count'))
      .where((eb) => eb.and(criteria))
      .executeTakeFirst()
      .then(Number)
  }
}
