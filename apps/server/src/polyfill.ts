import { AbstractEntity } from '@core/entities'

declare global {
  interface Array<T> {
    toDtos<B>(this: AbstractEntity<B>[]): B[]
  }
}

Array.prototype.toDtos = function <B>(options?: unknown): B[] {
  return <B[]>(this as AbstractEntity<B>[]).map((item) => item.toDto(options))
}
