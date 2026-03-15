import '@angular/compiler'
import '@analogjs/vitest-angular/setup-snapshots'
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed'
import { MockInstance } from 'vitest'

setupTestBed()

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Procedure = (...args: any[]) => any

  export type PartiallyMocked<Clazz> = {
    [Method in keyof Partial<Clazz>]: Clazz[Method] extends Procedure ? MockInstance<Clazz[Method]> : Clazz[Method]
  }
}
