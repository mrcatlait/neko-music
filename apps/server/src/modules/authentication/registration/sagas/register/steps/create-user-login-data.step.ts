import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { hashSync } from 'bcrypt'
import { SagaStep } from '@modules/shared/saga'
import { UserLoginDataRepository } from '@modules/authentication/shared/repositories'
import { EnvironmentVariables } from '@modules/shared/models'
import { RegisterSagaContext } from '../register.saga'

@Injectable()
export class CreateUserLoginDataStep extends SagaStep<RegisterSagaContext> {
  name = 'createUserLoginData'

  private readonly saltRounds: number

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly userLoginDataRepository: UserLoginDataRepository,
  ) {
    super()

    this.saltRounds = configService.get('SALT_ROUNDS')
  }

  async execute(): Promise<void> {
    const passwordHash = hashSync(this.context.password, this.saltRounds)

    const result = await this.userLoginDataRepository.create({
      email: this.context.email,
      password_hash: passwordHash,
    })

    this.context.userId = result.user_id
  }

  async compensate(): Promise<void> {
    await this.userLoginDataRepository.deleteByEmail(this.context.email)
  }
}
