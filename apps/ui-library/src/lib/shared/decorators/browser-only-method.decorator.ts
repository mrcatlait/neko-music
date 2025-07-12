import { browser } from '$app/environment'

/**
 * A method decorator that prevents method execution on the server.
 * When used on the server, the method will log a warning and return undefined.
 *
 * @example
 * ```typescript
 * class MyClass {
 *   @BrowserOnlyMethod
 *   playAudio() {
 *     // This will only execute in the browser
 *     audio.play();
 *   }
 *
 *   @BrowserOnlyMethod
 *   async saveToLocalStorage(data: any) {
 *     // This will only execute in the browser
 *     localStorage.setItem('key', JSON.stringify(data));
 *   }
 * }
 * ```
 */
export function BrowserOnlyMethod<T extends (...args: any[]) => unknown>(
  target: unknown,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> {
  const originalMethod = descriptor.value

  if (!originalMethod) {
    return descriptor
  }

  descriptor.value = function (this: unknown, ...args: Parameters<T>) {
    if (!browser) {
      return
    }

    return originalMethod.apply(this, args)
  } as T

  return descriptor
}
