export abstract class Service {
  private static serviceInstance: Service | null = null

  static getInstance<T extends Service>(this: new () => T): T {
    if (!Service.serviceInstance) {
      Service.serviceInstance = new this()
    }
    return Service.serviceInstance as T
  }
}
