import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthRepository } from '../../repositories'

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
    private readonly authRepository: AuthRepository,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  async invoke(params: GetUserUseCaseParams): Promise<GetUserUseCaseResult> {
    const account = await this.authRepository.findAccountById(params.userId)

    if (!account) {
      throw new UnauthorizedException()
    }

    const [userProfile, permissions] = await Promise.all([
      this.getUserProfileUseCase.invoke({ userId: account.id }),
      this.authRepository.findAccountPermissions(account.id),
    ])

    return {
      email: account.emailAddress,
      displayName: userProfile.displayName,
      permissions: permissions.map((permission) => permission.name),
    }
  }
}
