import { Command } from '@nestjs/cqrs'

export class DeleteAccountCommand extends Command<void> {
  constructor(readonly userId: string) {
    super()
  }
}
