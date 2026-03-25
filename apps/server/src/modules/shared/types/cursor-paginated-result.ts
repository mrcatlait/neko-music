import { Selectable } from 'kysely'

/**
 * Result shape for cursor-based repository queries (fetch limit+1, slice, expose last id as next cursor).
 */
export interface CursorPaginatedResult<Table> {
  readonly data: Selectable<Table>[]
  readonly nextCursor?: string
}
