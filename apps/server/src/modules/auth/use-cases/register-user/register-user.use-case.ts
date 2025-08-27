import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { genSaltSync, hashSync } from 'bcrypt'

import { RegisterUserValidator } from './register-user.validator'
import {
  PermissionRepository,
  RoleRepository,
  UserAccountRepository,
  UserCredentialsRepository,
} from '../../repositories'
import { AuthService } from '../../services'

import { DatabaseService } from '@/modules/database'
import { CreateUserProfileUseCase } from '@/modules/user/use-cases'
import { ConfigService } from '@/modules/config/services'

export interface RegisterUserUseCaseParams {
  readonly email: string
  readonly password: string
  readonly displayName: string
}

export interface RegisterUserUseCaseResult {
  readonly accessToken: string
  readonly refreshToken: string
  readonly email: string
  readonly displayName: string
  readonly permissions: string[]
}

@Injectable()
export class RegisterUserUseCase {
  private readonly logger = new Logger(this.constructor.name)

  private readonly saltRounds: number

  constructor(
    private readonly configService: ConfigService,
    private readonly registerValidator: RegisterUserValidator,
    private readonly databaseService: DatabaseService,
    private readonly roleRepository: RoleRepository,
    private readonly userAccountRepository: UserAccountRepository,
    private readonly userCredentialsRepository: UserCredentialsRepository,
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly authService: AuthService,
    private readonly permissionRepository: PermissionRepository,
  ) {
    this.saltRounds = this.configService.config.SALT_ROUNDS
  }

  async invoke(params: RegisterUserUseCaseParams): Promise<RegisterUserUseCaseResult> {
    const validationResult = await this.registerValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const defaultRole = await this.roleRepository.findDefault()

    if (!defaultRole) {
      this.logger.error('Default role not found')
      throw new InternalServerErrorException()
    }

    const userAccount = await this.databaseService.sql.begin(async (transaction) => {
      const account = await this.userAccountRepository.create(
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
          userId: account.id,
          passwordHash,
          passwordSalt,
        },
        transaction,
      )

      return account
    })

    const [userProfile, permissions] = await Promise.all([
      this.createUserProfileUseCase.invoke({
        userId: userAccount.id,
        displayName: params.displayName,
      }),
      this.permissionRepository.findByUserId(userAccount.id),
    ])

    const scopes = permissions.map((permission) => permission.name)

    const { accessToken, refreshToken } = await this.authService.generateTokenPair({
      userId: userAccount.id,
      scopes,
    })

    return {
      accessToken,
      refreshToken,
      email: userAccount.emailAddress,
      displayName: userProfile.displayName,
      permissions: scopes,
    }
  }
}
