import { Injectable } from '@nestjs/common'

import { UserRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'

export interface CreateUserProfileUseCaseParams {
  readonly userId: string
  readonly displayName: string
}

export interface CreateUserProfileUseCaseResult {
  readonly userId: string
  readonly displayName: string
}

@Injectable()
export class CreateUserProfileUseCase implements UseCase<
  CreateUserProfileUseCaseParams,
  CreateUserProfileUseCaseResult
> {
  constructor(private readonly userRepository: UserRepository) {}

  invoke(params: CreateUserProfileUseCaseParams): Promise<CreateUserProfileUseCaseResult> {
    return this.userRepository.createProfile({
      userId: params.userId,
      displayName: params.displayName,
    })
  }
}
