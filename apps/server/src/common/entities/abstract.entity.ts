import { UtilsService } from '@shared/services'

export abstract class AbstractEntity<T> {
  abstract dtoClass: new (entity: AbstractEntity<T>, options?: any) => T

  toDto(options?: any): T {
    return UtilsService.toDto(this.dtoClass, this, options)
  }
}
