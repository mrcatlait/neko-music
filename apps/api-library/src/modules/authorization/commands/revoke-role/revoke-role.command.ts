import { Command } from '@nestjs/cqrs'

export class RevokeRoleCommand extends Command<void> {
  constructor(
    readonly userId: string,
    readonly roleId: string,
  ) {
    super()
  }
}
