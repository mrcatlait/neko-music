import { Injectable, NotFoundException } from '@nestjs/common'

import { ArtistEntity } from '@/modules/catalog/entities'
import { WithArtwork } from '@/modules/shared/entities'
import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

export interface GetArtistByIdUseCaseParams {
  readonly id: string
}

export type GetArtistByIdUseCaseResult = WithArtwork<ArtistEntity>

@Injectable()
export class GetArtistByIdUseCase implements UseCase<GetArtistByIdUseCaseParams, GetArtistByIdUseCaseResult> {
  constructor(private readonly databaseService: DatabaseService) {}

  invoke(params: GetArtistByIdUseCaseParams): Promise<GetArtistByIdUseCaseResult> {
    return this.databaseService.sql<WithArtwork<ArtistEntity>[]>`
      SELECT
        artist.*,
        jsonb_build_object(
          'url', artwork."url",
          'sizes', artwork."sizes",
          'dominantColor', artwork."dominantColor"
        ) AS "artwork"
      FROM "catalog"."Artist" artist
        LEFT JOIN "catalog"."ArtistArtwork" artwork
          ON artwork."artistId" = artist."id"
      WHERE artist."id" = ${params.id}
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
