import { Context } from './context'

export class Params<T extends object> {
  constructor(
    private readonly context: Context,
    private readonly args: T = {} as T,
  ) {}

  optional(name: string, defaultValue: string): string {
    const arg = this.getParamValue(name)

    if (arg !== null) {
      return arg
    }

    return defaultValue
  }

  alias(name: string, defaultValue?: string): string {
    const value = this.getParamValue(name)

    if (!value) {
      if (defaultValue) {
        this.args[name] = defaultValue
        return this.context.alias(name)
      }

      throw new Error(`No ${name} supplied for alias, defaulting to ${defaultValue}`)
    }

    return this.context.alias(value)
  }

  private getParamValue(name: string): string | null {
    if (this.args[name]) {
      return this.args[name]
    }

    return null
  }
}
