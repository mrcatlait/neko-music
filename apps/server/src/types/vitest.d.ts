import { MockInstance } from 'vitest'

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Procedure = (...args: any[]) => any

  export type PartiallyMocked<Clazz> = {
    [Method in keyof Partial<Clazz>]: Clazz[Method] extends Procedure ? MockInstance<Clazz[Method]> : Clazz[Method]
  }
}
