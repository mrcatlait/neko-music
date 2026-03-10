export class Context {
  private readonly seed = Math.random().toString(36).substring(7)
  private readonly aliases = new Map<string, string>()

  alias(name: string): string {
    if (!this.aliases.has(name)) {
      if (this.isEmail(name)) {
        const [value, domain] = name.split('@')
        this.aliases.set(name, `${value}${this.seed}@${domain}`)
      } else {
        this.aliases.set(name, name + this.seed)
      }
    }

    return this.aliases.get(name)!
  }

  private isEmail(email: string): boolean {
    return email.includes('@')
  }
}
