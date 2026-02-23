import { sql } from 'kysely'

export const createComment = (comment: string) => sql`comment ${sql.lit(comment)}`

export const randomUuid = () => sql`gen_random_uuid()`
