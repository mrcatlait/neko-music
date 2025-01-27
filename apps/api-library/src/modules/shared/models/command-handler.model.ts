export interface CommandHandler<Command, Result = void> {
  handle(command: Command): Promise<Result>
}
