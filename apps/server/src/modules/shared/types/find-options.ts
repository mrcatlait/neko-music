import { Selectable } from 'kysely'

type AtLeastOne<T> = {
  [K in keyof T]: Partial<T> & Pick<T, K>
}[keyof T]

export type FindOptions<Table> = AtLeastOne<Selectable<Table>>
