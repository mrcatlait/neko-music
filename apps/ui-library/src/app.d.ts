// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { MockInstance } from 'vitest'

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Procedure = (...args: any[]) => any

  export type PartiallyMocked<Clazz> = {
    [Method in keyof Partial<Clazz>]: Clazz[Method] extends Procedure ? MockInstance<Clazz[Method]> : Clazz[Method]
  }
}

export {}
