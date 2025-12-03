import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'

import { RegisterUserValidator } from './register-user.validator'
import { AuthRepository } from '../../repositories'
import { AuthService } from '../../services'

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
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly registerValidator: RegisterUserValidator,
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly authService: AuthService,
  ) {
    this.saltRounds = this.configService.config.SALT_ROUNDS
  }

  async invoke(params: RegisterUserUseCaseParams): Promise<RegisterUserUseCaseResult> {
    const validationResult = await this.registerValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const defaultRole = await this.authRepository.findDefaultRole()

    if (!defaultRole) {
      this.logger.error('Default role not found')
      throw new InternalServerErrorException()
    }

    const passwordSalt = this.authService.generatePasswordSalt()
    const passwordHash = this.authService.generatePasswordHash(params.password, passwordSalt)

    const userAccount = await this.authRepository.createAccountWithCredentials({
      email: params.email,
      passwordHash,
      passwordSalt,
      roleId: defaultRole.id,
    })

    const [userProfile, permissions] = await Promise.all([
      this.createUserProfileUseCase.invoke({
        userId: userAccount.id,
        displayName: params.displayName,
      }),
      this.authRepository.findAccountPermissions(userAccount.id),
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
