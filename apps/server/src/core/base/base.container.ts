type Clazz<T, Args extends unknown[]> = new (...args: Args) => T

export abstract class BaseContainer {
  private static readonly instances = new Map<string, unknown>()

  protected static getInstance<T, Args extends unknown[]>(clazz: Clazz<T, Args>, factory: () => T): T {
    const key = clazz.name

    if (!this.instances.has(key)) {
      this.instances.set(key, factory())
    }
    return this.instances.get(key) as T
  }

  protected static clearInstance(key: string): void {
    this.instances.delete(key)
  }

  protected static clearAll(): void {
    this.instances.clear()
  }
}
