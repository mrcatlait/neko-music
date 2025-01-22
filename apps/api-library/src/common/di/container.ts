type Service<T> = new () => T

/**
 * Simple dependency injection container for services.
 *
 * @example
 * ```ts
 * class MyService {
 *   constructor() {
 *     this.repository = Container.get(MyRepository)
 *   }
 * }
 * ```
 */
export class Container {
  private static readonly services = new Map<string, unknown>()

  /**
   * Get or create a service instance.
   *
   * @param service - The service to get.
   * @returns The service instance.
   */
  static get<T>(service: Service<T>): T {
    if (this.services.has(service.name)) {
      return this.services.get(service.name) as T
    }

    const instance = new service()

    this.services.set(service.name, instance)

    return instance
  }

  /**
   * Set a service instance.
   *
   * @param service - The service to set.
   * @param instance - The service instance.
   */
  static set<T>(service: Service<T>, instance: T) {
    this.services.set(service.name, instance)
  }
}
