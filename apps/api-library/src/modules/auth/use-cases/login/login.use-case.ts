import { Injectable, UnauthorizedException } from '@nestjs/common'

import { PermissionRepository, UserAccountRepository } from '../../repositories'
import { LoginValidator } from './login.validator'
import { UserSession } from '../../interfaces'

import { GetUserProfileUseCase } from '@/modules/user/use-cases'

export interface LoginUseCaseParams {
  readonly email: string
  readonly password: string
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly loginValidator: LoginValidator,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async invoke(params: LoginUseCaseParams): Promise<UserSession> {
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

    return {
      userId: userAccount.id,
      displayName: userProfile.displayName,
      permissions: permissions.map((permission) => permission.name),
    }
  }
}
