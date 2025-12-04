export class Context {
  private readonly seed = `test-${Math.random().toString(36).substring(7)}`
  private readonly aliases = new Map<string, string>()

  alias(name: string): string {
    if (!this.aliases.has(name)) {
      /**
       * @todo Won't work with emails
       */
      this.aliases.set(name, name + this.seed)
    }

    return this.aliases.get(name)!
  }
}
