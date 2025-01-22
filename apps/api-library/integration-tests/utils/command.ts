export class CommandBuilder {
  private readonly args: string[] = []

  constructor(baseCommand: string) {
    this.args.push(baseCommand)
  }

  add(...args: string[]): this {
    this.args.push(...args)
    return this
  }

  addFlag(flag: string, value?: string): this {
    this.args.push(flag)

    if (value !== undefined) {
      this.args.push(value)
    }

    return this
  }

  addFlags(flag: string, values?: string[]): this {
    if (!values) {
      return this
    }

    values.forEach((value) => {
      this.addFlag(flag, value)
    })

    return this
  }

  addKeyValue(key: string, value: string): this {
    this.args.push(`${key}=${value}`)
    return this
  }

  build(): string[] {
    return this.args
  }

  toString(): string {
    return this.args.join(' ')
  }
}
