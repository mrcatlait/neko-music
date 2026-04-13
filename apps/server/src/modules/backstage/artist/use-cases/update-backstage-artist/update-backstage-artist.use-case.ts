import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { UpdateBackstageArtistValidator } from './update-backstage-artist.validator'
import { ArtistRepository } from '../../repositories'
import { BackstageArtistTable } from '../../../backstage.schema'
import { ProcessBackstageArtistLifecycleUseCase } from '../process-backstage-artist-lifecycle'

import { UseCase } from '@/modules/shared/types'

export interface UpdateBackstageArtistUseCaseParams {
  readonly id: string
  readonly name: string
  readonly genres: string[]
  readonly verified: boolean
  readonly userId: string
}

export type UpdateBackstageArtistUseCaseResult = Selectable<BackstageArtistTable>

@Injectable()
export class UpdateBackstageArtistUseCase implements UseCase<
  UpdateBackstageArtistUseCaseParams,
  UpdateBackstageArtistUseCaseResult
> {
  constructor(
    private readonly updateBackstageArtistValidator: UpdateBackstageArtistValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly processBackstageArtistLifecycleUseCase: ProcessBackstageArtistLifecycleUseCase,
  ) {}

  async invoke(params: UpdateBackstageArtistUseCaseParams): Promise<UpdateBackstageArtistUseCaseResult> {
    await this.updateBackstageArtistValidator.validate(params)

    const artist = await this.artistRepository.updateWithGenres(params.id, {
      name: params.name,
      verified: params.verified,
      updatedBy: params.userId,
      updatedAt: new Date(),
      genres: params.genres,
    })

    await this.processBackstageArtistLifecycleUseCase.invoke({
      artistId: artist.id,
    })

    return artist
  }
}
