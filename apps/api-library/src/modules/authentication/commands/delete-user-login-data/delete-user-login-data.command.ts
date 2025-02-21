import { Command } from '@nestjs/cqrs'

export class DeleteUserLoginDataCommand extends Command<void> {
  constructor(readonly userId: string) {
    super()
  }
}
