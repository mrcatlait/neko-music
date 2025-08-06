import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { genSaltSync, hashSync } from 'bcrypt'

import { RegisterUserValidator } from './register-user.validator'
import { RoleRepository, UserAccountRepository, UserCredentialsRepository } from '../../repositories'

import { DatabaseService } from '@modules/database'
import { CreateUserProfileUseCase } from '@modules/user/use-cases'

export interface RegisterUserUseCaseParams {
  readonly email: string
  readonly password: string
  readonly displayName: string
}

@Injectable()
export class RegisterUserUseCase {
  private readonly logger = new Logger(this.constructor.name)

  private readonly saltRounds: number

  constructor(
    private readonly registerValidator: RegisterUserValidator,
    private readonly databaseService: DatabaseService,
    private readonly roleRepository: RoleRepository,
    private readonly userAccountRepository: UserAccountRepository,
    private readonly userCredentialsRepository: UserCredentialsRepository,
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
  ) {
    this.saltRounds = configService.get('SALT_ROUNDS')
  }

  async invoke(params: RegisterUserUseCaseParams): Promise<void> {
    const validationResult = await this.registerValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const defaultRole = await this.roleRepository.findDefault()

    if (!defaultRole) {
      this.logger.error('Default role not found')
      throw new InternalServerErrorException()
    }

    await this.databaseService.sql.begin(async (transaction) => {
      const userAccount = await this.userAccountRepository.create(
        {
          emailAddress: params.email,
          roleId: defaultRole.id,
          verified: false,
        },
        transaction,
      )

      const passwordSalt = genSaltSync(this.saltRounds)
      const passwordHash = hashSync(params.password, passwordSalt)

      await this.userCredentialsRepository.create(
        {
          userId: userAccount.id,
          passwordHash,
          passwordSalt,
        },
        transaction,
      )

      await this.createUserProfileUseCase.invoke({
        userId: userAccount.id,
        displayName: params.displayName,
      })
    })
  }
}
