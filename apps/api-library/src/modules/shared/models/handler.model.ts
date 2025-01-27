export interface Handler<Command, Result = void> {
  handle(command: Command): Promise<Result>
}
