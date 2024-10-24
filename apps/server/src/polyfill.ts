import { AbstractEntity } from '@common/entities'

declare global {
  interface Array<T> {
    toDtos<B>(this: AbstractEntity<B>[]): B[]
  }
}

Array.prototype.toDtos = function <B>(options?: unknown): B[] {
  return (this as AbstractEntity<B>[]).map((item) => item.toDto(options))
}
