class Logger {
  private readonly level: string

  constructor() {
    this.level = this.getLevel()
  }

  private getLevel(): string {
    return process.env.DEBUG?.split(',').includes('neko-testcontainers') ? 'debug' : 'info'
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.level === 'debug') {
      console.debug(message, ...args)
    }
  }

  info(message: string, ...args: unknown[]): void {
    console.info(message, ...args)
  }

  error(message: string, ...args: unknown[]): void {
    console.error(message, ...args)
  }
}

export const logger = new Logger()
