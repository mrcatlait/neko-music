import { NgModule } from '@angular/core'
import { ɵgetCleanupHook as getCleanupHook, getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'
import { afterEach, beforeEach, MockInstance } from 'vitest'

const providers: NgModule['providers'] = []

beforeEach(getCleanupHook(false))
afterEach(getCleanupHook(true))

@NgModule({ providers })
export class TestModule {}

getTestBed().initTestEnvironment([BrowserTestingModule, TestModule], platformBrowserTesting(), {
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
})

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Procedure = (...args: any[]) => any

  export type PartiallyMocked<Clazz> = {
    [Method in keyof Partial<Clazz>]: Clazz[Method] extends Procedure ? MockInstance<Clazz[Method]> : Clazz[Method]
  }
}
