import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { AddGenreValidator } from './add-genre.validator'
import { GenreRepository } from '../../../repositories'

import { BackstageGenreTable } from '@/modules/backstage/backstage.schema'
import { PublishingStatus } from '@/modules/backstage/enums'

export interface AddGenreUseCaseParams {
  readonly name: string
  readonly slug: string
  readonly userId: string
}

export type AddGenreUseCaseResult = Selectable<BackstageGenreTable>

// todo rename to CreateGenreUseCase
@Injectable()
export class AddGenreUseCase {
  constructor(
    private readonly addGenreValidator: AddGenreValidator,
    private readonly genreRepository: GenreRepository,
  ) {}

  async invoke(params: AddGenreUseCaseParams): Promise<AddGenreUseCaseResult> {
    await this.addGenreValidator.validate(params)

    return this.genreRepository.create({
      name: params.name,
      slug: params.slug,
      status: PublishingStatus.Draft,
      createdBy: params.userId,
      updatedBy: params.userId,
    })
  }
}
