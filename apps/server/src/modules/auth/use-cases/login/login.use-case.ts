import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Role } from '@neko/permissions'

import { AuthRepository } from '../../repositories'
import { LoginValidator } from './login.validator'
import { AuthService } from '../../services'

import { GetUserProfileUseCase } from '@/modules/user/use-cases'
import { UseCase } from '@/modules/shared/interfaces'

export interface LoginUseCaseParams {
  readonly email: string
  readonly password: string
}

export interface LoginUseCaseResult {
  readonly accessToken: string
  readonly refreshToken: string
  readonly email: string
  readonly displayName: string
  readonly role: string
}

@Injectable()
export class LoginUseCase implements UseCase<LoginUseCaseParams, LoginUseCaseResult> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly loginValidator: LoginValidator,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly authService: AuthService,
  ) {}

  async invoke(params: LoginUseCaseParams): Promise<LoginUseCaseResult> {
    const account = await this.authRepository.findAccountWithCredentialsByEmail(params.email)

    // Running the validator before checking if the account exists to avoid timing attacks
    const validationResult = this.loginValidator.validate({
      password: params.password,
      passwordHash: account?.passwordHash,
    })

    if (!validationResult.isValid || !account) {
      throw new UnauthorizedException()
    }

    const userProfile = await this.getUserProfileUseCase.invoke({ userId: account.id })

    const { accessToken, refreshToken } = await this.authService.generateTokenPair({
      userId: account.id,
      role: account.role as Role,
    })

    return {
      accessToken,
      refreshToken,
      email: account.emailAddress,
      displayName: userProfile.displayName,
      role: account.role,
    }
  }
}
