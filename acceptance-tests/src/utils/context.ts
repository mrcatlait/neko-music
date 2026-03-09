interface Session {
  cookies: string | null
  accessToken: string | null
  email: string | null
}

export class Context {
  private readonly seed = `test-${Math.random().toString(36).substring(7)}`
  private readonly aliases = new Map<string, string>()
  private session: Session = { cookies: null, accessToken: null, email: null }

  alias(name: string): string {
    if (!this.aliases.has(name)) {
      /**
       * @todo Won't work with emails
       */
      this.aliases.set(name, name + this.seed)
    }

    return this.aliases.get(name)!
  }

  setSession(options: Partial<Session>): void {
    this.session = { ...this.session, ...options }
  }

  get cookies(): string | null {
    return this.session.cookies
  }

  get accessToken(): string | null {
    return this.session.accessToken
  }

  get email(): string | null {
    return this.session.email
  }
}
