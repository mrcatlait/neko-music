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

import { CreateUserProfileUseCase } from '@/modules/user/use-cases'
import { ConfigService } from '@/modules/config/services'
import { Database, InjectDatabase } from '@/modules/database'

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
    @InjectDatabase() private readonly database: Database,
    private readonly configService: ConfigService,
    private readonly registerValidator: RegisterUserValidator,
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

    const defaultRole = await this.roleRepository.findDefaultRole()

    if (!defaultRole) {
      this.logger.error('Default role not found')
      throw new InternalServerErrorException()
    }

    // Create user account and credentials in a transaction
    const userAccount = await this.database.transaction().execute(async (trx) => {
      const account = await trx
        .insertInto('auth.UserAccount')
        .values({
          emailAddress: params.email,
          roleId: defaultRole.id,
          verified: false,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      const passwordSalt = genSaltSync(this.saltRounds)
      const passwordHash = hashSync(params.password, passwordSalt)

      await trx
        .insertInto('auth.UserCredentials')
        .values({
          userId: account.id,
          passwordHash,
          passwordSalt,
        })
        .execute()

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
