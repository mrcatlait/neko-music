import { Injectable, NotFoundException } from '@nestjs/common'

import { UserRepository } from '../../repositories'

export interface GetUserProfileUseCaseParams {
  readonly userId: string
}

export interface GetUserProfileUseCaseResult {
  readonly userId: string
  readonly displayName: string
}

@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async invoke(params: GetUserProfileUseCaseParams): Promise<GetUserProfileUseCaseResult> {
    const userProfile = await this.userRepository.findProfileByUserId(params.userId)

    if (!userProfile) {
      throw new NotFoundException('User profile not found')
    }

    return userProfile
  }
}
