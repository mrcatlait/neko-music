import { Command } from '@nestjs/cqrs'

export class CreateUserLoginDataCommand extends Command<{ user_id: string }> {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {
    super()
  }
}
