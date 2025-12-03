import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthRepository } from '../../repositories'
import { LoginValidator } from './login.validator'
import { AuthService } from '../../services'

import { GetUserProfileUseCase } from '@/modules/user/use-cases'

export interface LoginUseCaseParams {
  readonly email: string
  readonly password: string
}

export interface LoginUseCaseResult {
  readonly accessToken: string
  readonly refreshToken: string
  readonly email: string
  readonly displayName: string
  readonly permissions: string[]
}

@Injectable()
export class LoginUseCase {
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

    const [userProfile, permissions] = await Promise.all([
      this.getUserProfileUseCase.invoke({ userId: account.id }),
      this.authRepository.findAccountPermissions(account.id),
    ])

    const scopes = permissions.map((permission) => permission.name)

    const { accessToken, refreshToken } = await this.authService.generateTokenPair({
      userId: account.id,
      scopes,
    })

    return {
      accessToken,
      refreshToken,
      email: account.emailAddress,
      displayName: userProfile.displayName,
      permissions: scopes,
    }
  }
}
