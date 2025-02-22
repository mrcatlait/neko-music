import { CommandBus, EventBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs'
import { Logger } from '@nestjs/common'

import { UserRegistrationCreateAccountEvent } from './user-registration-create-account.event'
import { UserRegistrationAssignRoleFailedEvent } from './user-registration-assign-role-failed.event'
import { UserRegistrationDefaultRoleNotFoundEvent } from './user-registration-default-role-not-found.event'

import { AssignRoleCommand } from '@modules/authorization/commands'
import { GetDefaultRoleQuery } from '@modules/authorization/queries'

export class UserRegistrationAssignRoleEvent {
  constructor(
    readonly userId: string,
    readonly displayName: string,
  ) {}
}

@EventsHandler(UserRegistrationAssignRoleEvent)
export class UserRegistrationAssignRoleEventHandler implements IEventHandler<UserRegistrationAssignRoleEvent> {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: UserRegistrationAssignRoleEvent): Promise<void> {
    try {
      const defaultRole = await this.queryBus.execute(new GetDefaultRoleQuery())

      try {
        await this.commandBus.execute(new AssignRoleCommand(event.userId, defaultRole.id))
        this.eventBus.publish(new UserRegistrationCreateAccountEvent(event.userId, defaultRole.id, event.displayName))
      } catch (error) {
        this.logger.error(error)
        this.eventBus.publish(new UserRegistrationAssignRoleFailedEvent(event.userId))
      }
    } catch (error) {
      this.logger.error(error)
      this.eventBus.publish(new UserRegistrationDefaultRoleNotFoundEvent(event.userId))
    }
  }
}
