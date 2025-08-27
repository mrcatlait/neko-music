import { Injectable } from '@nestjs/common'

import { UserProfileEntity } from '../../entities'
import { UserProfileRepository } from '../../repositories'

export interface CreateUserProfileUseCaseParams {
  readonly userId: string
  readonly displayName: string
}

@Injectable()
export class CreateUserProfileUseCase {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async invoke(params: CreateUserProfileUseCaseParams): Promise<UserProfileEntity> {
    return this.userProfileRepository.create({
      userId: params.userId,
      displayName: params.displayName,
    })
  }
}
