import { BadRequestException, Injectable } from '@nestjs/common'

import { TrackArtistRepository, TrackGenreRepository, TrackRepository } from '../../repositories'
import { TrackEntity } from '../../entities'
import { CreateTrackValidator } from './create-track.validator'
import { RecordStatus } from '../../enums'

import { DatabaseService } from '@/modules/database'

export interface CreateTrackUseCaseParams {
  readonly name: string
  readonly duration: number
  readonly explicit: boolean
  readonly genres: string[]
  readonly artists: string[]
  readonly album: string
  readonly releaseDate: Date
  readonly diskNumber: number
  readonly trackNumber: number
}

@Injectable()
export class CreateTrackUseCase {
  constructor(
    private readonly createTrackValidator: CreateTrackValidator,
    private readonly databaseService: DatabaseService,
    private readonly trackRepository: TrackRepository,
    private readonly trackGenreRepository: TrackGenreRepository,
    private readonly trackArtistRepository: TrackArtistRepository,
  ) {}

  async invoke(params: CreateTrackUseCaseParams): Promise<TrackEntity> {
    const validationResult = await this.createTrackValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService.sql.begin(async (transaction) => {
      const track = await this.trackRepository.create(
        {
          name: params.name,
          albumId: params.album,
          trackNumber: params.trackNumber,
          diskNumber: params.diskNumber,
          duration: params.duration,
          explicit: params.explicit,
          releaseDate: params.releaseDate,
          hasLyrics: false,
          status: RecordStatus.DRAFT,
        },
        transaction,
      )

      await Promise.all([
        this.trackGenreRepository.createMany(
          params.genres.map((genre, index) => ({
            trackId: track.id,
            genreId: genre,
            position: index,
          })),
          transaction,
        ),
        this.trackArtistRepository.createMany(
          params.artists.map((artist, index) => ({
            trackId: track.id,
            artistId: artist,
            position: index,
          })),
          transaction,
        ),
      ])

      return track
    })
  }
}
