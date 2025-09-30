import { Injectable, NotFoundException } from '@nestjs/common'

import { ArtistEntity } from '@/modules/catalog/entities'
import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

export interface GetArtistByIdUseCaseParams {
  readonly id: string
}

export type GetArtistByIdUseCaseResult = ArtistEntity

@Injectable()
export class GetArtistByIdUseCase implements UseCase<GetArtistByIdUseCaseParams, GetArtistByIdUseCaseResult> {
  constructor(private readonly databaseService: DatabaseService) {}

  invoke(params: GetArtistByIdUseCaseParams): Promise<GetArtistByIdUseCaseResult> {
    return this.databaseService.sql<ArtistEntity[]>`
      SELECT *
      FROM "catalog"."Artist"
      WHERE "id" = ${params.id}
      LIMIT 1
    `.then((result) => {
      const artist = result.at(0)

      if (!artist) {
        throw new NotFoundException('Artist not found')
      }

      return artist
    })
  }
}
