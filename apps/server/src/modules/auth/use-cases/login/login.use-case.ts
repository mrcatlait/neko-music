import { Injectable, UnauthorizedException } from '@nestjs/common'

import { PermissionRepository, UserAccountRepository } from '../../repositories'
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
    private readonly userAccountRepository: UserAccountRepository,
    private readonly loginValidator: LoginValidator,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly permissionRepository: PermissionRepository,
    private readonly authService: AuthService,
  ) {}

  async invoke(params: LoginUseCaseParams): Promise<LoginUseCaseResult> {
    const userAccount = await this.userAccountRepository.findOneByEmail(params.email)

    const validationResult = this.loginValidator.validate({
      password: params.password,
      passwordHash: userAccount?.passwordHash,
    })

    if (!validationResult.isValid || !userAccount) {
      throw new UnauthorizedException()
    }

    const [userProfile, permissions] = await Promise.all([
      this.getUserProfileUseCase.invoke({ userId: userAccount.id }),
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
