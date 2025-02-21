import { Command } from '@nestjs/cqrs'

export class CreateAccountCommand extends Command<void> {
  constructor(
    readonly userId: string,
    readonly displayName: string,
  ) {
    super()
  }
}
