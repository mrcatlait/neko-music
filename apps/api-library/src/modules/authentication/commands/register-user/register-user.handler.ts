import { BadRequestException } from '@nestjs/common'
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'

import { RegisterUserCommand } from './register-user.command'
import { RegisterUserValidator } from './register-user.validator'
import { CreateUserLoginDataCommand } from '../create-user-login-data'

import { UserRegistrationLoginDataCreatedEvent } from '@modules/authentication/events'

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly registerValidator: RegisterUserValidator,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const validationResult = await this.registerValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const userLoginData = await this.commandBus.execute(new CreateUserLoginDataCommand(command.email, command.password))

    this.eventBus.publish(new UserRegistrationLoginDataCreatedEvent(command.displayName, userLoginData.user_id))
  }
}
