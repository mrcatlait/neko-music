export abstract class SagaStep<Context> {
  protected context: Context

  setContext(context: Context): void {
    this.context = context
  }

  abstract get name(): string

  abstract execute(): Promise<void> | void

  abstract compensate(): Promise<void> | void

  getName(): string {
    return this.name
  }
}
