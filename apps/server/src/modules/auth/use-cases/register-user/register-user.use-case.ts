import { Injectable } from '@nestjs/common'
import { Role, Roles } from '@neko/permissions'

import { RegisterUserValidator } from './register-user.validator'
import { AuthRepository } from '../../repositories'
import { AuthService } from '../../services'

import { CreateUserProfileUseCase } from '@/modules/user/use-cases'
import { UseCase } from '@/modules/shared/types'

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
  readonly role: string
  readonly id: string
}

@Injectable()
export class RegisterUserUseCase implements UseCase<RegisterUserUseCaseParams, RegisterUserUseCaseResult> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly registerValidator: RegisterUserValidator,
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly authService: AuthService,
  ) {}

  async invoke(params: RegisterUserUseCaseParams): Promise<RegisterUserUseCaseResult> {
    await this.registerValidator.validate(params)

    const passwordSalt = this.authService.generatePasswordSalt()
    const passwordHash = this.authService.generatePasswordHash(params.password, passwordSalt)

    const userAccount = await this.authRepository.createAccountWithCredentials({
      email: params.email,
      passwordHash,
      passwordSalt,
      role: Roles.User,
    })

    const userProfile = await this.createUserProfileUseCase.invoke({
      userId: userAccount.id,
      displayName: params.displayName,
    })

    const { accessToken, refreshToken } = await this.authService.generateTokenPair({
      userId: userAccount.id,
      role: userAccount.role as Role,
    })

    return {
      accessToken,
      refreshToken,
      email: userAccount.emailAddress,
      displayName: userProfile.displayName,
      role: userAccount.role,
      id: userAccount.id,
    }
  }
}
