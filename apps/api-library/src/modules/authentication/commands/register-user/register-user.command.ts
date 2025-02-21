import { Command } from '@nestjs/cqrs'

export class RegisterUserCommand extends Command<void> {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly displayName: string,
  ) {
    super()
  }
}
