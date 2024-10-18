import { UtilsService } from '@shared/services'

export abstract class AbstractEntity<T> {
  abstract dtoClass: new (entity: AbstractEntity<T>, options?: unknown) => T

  toDto(options?: unknown): T {
    return UtilsService.toDto(this.dtoClass, this, options)
  }
}
