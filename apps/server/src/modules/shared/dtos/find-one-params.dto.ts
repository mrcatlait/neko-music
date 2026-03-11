import { IsUUID } from 'class-validator'

/**
 * DTO for finding a single entity by its UUID.
 * @example
 * ```ts
 * const params = new FindOneParams()
 * params.id = '00000000-0000-0000-0000-000000000000'
 * ```
 */
export class FindOneParams {
  @IsUUID()
  id: string
}
