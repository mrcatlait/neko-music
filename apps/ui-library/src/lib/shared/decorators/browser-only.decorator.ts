import { browser } from '$app/environment'

type Constructor<T = object> = new (...args: never[]) => T

/**
 * A decorator that makes a class browser-only. When used on the server:
 * - Methods return async no-op functions that log warnings
 * - Property getters return undefined and log warnings
 * - Property setters log warnings and do nothing
 *
 * @example
 * ```typescript
 *⠀@BrowserOnly
 * class MyBrowserClass {
 *   private value = 42;
 *
 *   getValue() {
 *     return this.value;
 *   }
 * }
 * ```
 */
export function BrowserOnly<T extends Constructor>(constructor: T) {
  if (!browser) {
    return new Proxy(constructor, {
      construct: () => {
        return new Proxy(
          {},
          {
            get: (_, prop) => {
              const propName = String(prop)

              // Handle methods
              return async (...args: unknown[]) => {
                console.warn(
                  `[BrowserOnly] Method "${propName}" is not available on the server. ` +
                    `Called with args: ${JSON.stringify(args)}`,
                )
                return undefined
              }
            },
            set: (_, prop, value) => {
              const propName = String(prop)
              console.warn(
                `[BrowserOnly] Cannot set property "${propName}" on the server. ` +
                  `Attempted to set value: ${JSON.stringify(value)}`,
              )
              return true // Indicate success to prevent errors
            },
            getOwnPropertyDescriptor: (_, prop) => {
              const propName = String(prop)
              console.warn(`[BrowserOnly] Property "${propName}" is not available on the server`)
              return {
                configurable: true,
                enumerable: true,
                writable: true,
                value: undefined,
              }
            },
          },
        )
      },
    })
  }

  return constructor
}
