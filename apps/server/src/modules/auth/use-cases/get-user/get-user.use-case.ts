import { Injectable, UnauthorizedException } from '@nestjs/common'

import { PermissionRepository, UserAccountRepository } from '../../repositories'

import { GetUserProfileUseCase } from '@/modules/user/use-cases'

export interface GetUserUseCaseParams {
  readonly userId: string
}

export interface GetUserUseCaseResult {
  readonly email: string
  readonly displayName: string
  readonly permissions: string[]
}

@Injectable()
export class GetUserUseCase {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async invoke(params: GetUserUseCaseParams): Promise<GetUserUseCaseResult> {
    const userAccount = await this.userAccountRepository.findOne(params.userId)

    if (!userAccount) {
      throw new UnauthorizedException()
    }

    const [userProfile, permissions] = await Promise.all([
      this.getUserProfileUseCase.invoke({ userId: userAccount.id }),
      this.permissionRepository.findByUserId(userAccount.id),
    ])

    return {
      email: userAccount.emailAddress,
      displayName: userProfile.displayName,
      permissions: permissions.map((permission) => permission.name),
    }
  }
}
