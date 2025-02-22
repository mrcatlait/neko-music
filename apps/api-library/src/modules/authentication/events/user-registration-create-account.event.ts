import { CommandBus, EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Logger } from '@nestjs/common'

import { UserRegistrationCreateAccountFailedEvent } from './user-registration-create-account-failed.event'

import { CreateAccountCommand } from '@modules/user/commands'

export class UserRegistrationCreateAccountEvent {
  constructor(
    readonly userId: string,
    readonly roleId: string,
    readonly displayName: string,
  ) {}
}

@EventsHandler(UserRegistrationCreateAccountEvent)
export class UserRegistrationCreateAccountEventHandler implements IEventHandler<UserRegistrationCreateAccountEvent> {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: UserRegistrationCreateAccountEvent): Promise<void> {
    try {
      await this.commandBus.execute(new CreateAccountCommand(event.userId, event.displayName))
    } catch (error) {
      this.logger.error(error)
      this.eventBus.publish(new UserRegistrationCreateAccountFailedEvent(event.userId, event.roleId))
    }
  }
}
