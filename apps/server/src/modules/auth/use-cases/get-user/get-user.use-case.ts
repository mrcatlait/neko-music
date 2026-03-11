import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthRepository } from '../../repositories'

import { GetUserProfileUseCase } from '@/modules/user/use-cases'

export interface GetUserUseCaseParams {
  readonly userId: string
}

export interface GetUserUseCaseResult {
  readonly email: string
  readonly displayName: string
  readonly role: string
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

    const userProfile = await this.getUserProfileUseCase.invoke({ userId: account.id })

    return {
      email: account.emailAddress,
      displayName: userProfile.displayName,
      role: account.role,
    }
  }
}
