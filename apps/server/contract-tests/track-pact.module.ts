import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { MessageStateHandlers } from '@pact-foundation/pact'
import { Repository } from 'typeorm'
import { PartiallyMocked } from 'vitest'

import { PactModule } from './pact.module'

import { GenreEntity, TrackArtistEntity, TrackEntity, TrackImageEntity } from '@features/track/entities'

@Global()
@Module({})
export class TrackPactModule {
  static register(): DynamicModule {
    const trackRepositoryMock: PartiallyMocked<Repository<TrackEntity>>
    const imageRepositoryMock: PartiallyMocked<Repository<TrackImageEntity>>
    const artistRepositoryMock: PartiallyMocked<Repository<TrackArtistEntity>>
    const genreRepositoryMock: PartiallyMocked<Repository<GenreEntity>>

    const services: Provider[] = [
      {
        provide: getRepositoryToken(TrackEntity),
        useValue: trackRepositoryMock,
      },
      {
        provide: getRepositoryToken(TrackImageEntity),
        useValue: imageRepositoryMock,
      },
      {
        provide: getRepositoryToken(TrackArtistEntity),
        useValue: artistRepositoryMock,
      },
      {
        provide: getRepositoryToken(GenreEntity),
        useValue: genreRepositoryMock,
      },
    ]

    const stateHandlers: MessageStateHandlers = {
      'list of tracks is empty': () => {
        trackRepositoryMock.findAndCount?.mockImplementation(() => Promise.resolve([[], 0]))

        return Promise.resolve()
      },
      'list of tracks exists': () => {
        trackRepositoryMock.findAndCount?.mockImplementation(() => Promise.resolve([[], 0]))

        return Promise.resolve()
      },
    }

    return {
      module: TrackPactModule,
      imports: [PactModule.register({ stateHandlers })],
      providers: services,
      exports: services,
    }
  }
}
