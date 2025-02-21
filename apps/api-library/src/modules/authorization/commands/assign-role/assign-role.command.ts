import { Command } from '@nestjs/cqrs'

export class AssignRoleCommand extends Command<void> {
  constructor(
    readonly userId: string,
    readonly roleId: string,
  ) {
    super()
  }
}
