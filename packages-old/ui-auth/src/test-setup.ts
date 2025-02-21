import '@analogjs/vite-plugin-angular/setup-vitest'

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing'
import { getTestBed } from '@angular/core/testing'
import { MockInstance } from 'vitest'

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Procedure = (...args: any[]) => any

  export type PartiallyMocked<Clazz> = {
    [Method in keyof Partial<Clazz>]: Clazz[Method] extends Procedure ? MockInstance<Clazz[Method]> : Clazz[Method]
  }
}
