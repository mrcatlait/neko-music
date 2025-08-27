import { Injectable, NotFoundException } from '@nestjs/common'

import { UserProfileEntity } from '../../entities'
import { UserProfileRepository } from '../../repositories'

export interface GetUserProfileUseCaseParams {
  readonly userId: string
}

@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async invoke(params: GetUserProfileUseCaseParams): Promise<UserProfileEntity> {
    const userProfile = await this.userProfileRepository.findOne(params.userId)

    if (!userProfile) {
      throw new NotFoundException('User profile not found')
    }

    return userProfile
  }
}
