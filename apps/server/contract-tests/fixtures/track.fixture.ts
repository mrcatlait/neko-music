import { TestingModuleBuilder } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { GenreEntity, TrackArtistEntity, TrackEntity, TrackImageEntity } from '@features/track/entities'
import { repositoryMockFactory } from 'contract-tests/utils'
import { trackFactory } from 'contract-tests/factories'

const trackRepositoryMock = repositoryMockFactory<TrackEntity>()
const imageRepositoryMock = repositoryMockFactory<TrackImageEntity>()
const artistRepositoryMock = repositoryMockFactory<TrackArtistEntity>()
const genreRepositoryMock = repositoryMockFactory<GenreEntity>()

export const registerTrackRepositories = (builder: TestingModuleBuilder): TestingModuleBuilder => {
  return builder
    .overrideProvider(getRepositoryToken(TrackEntity))
    .useValue(trackRepositoryMock)
    .overrideProvider(getRepositoryToken(TrackImageEntity))
    .useValue(imageRepositoryMock)
    .overrideProvider(getRepositoryToken(TrackArtistEntity))
    .useValue(artistRepositoryMock)
    .overrideProvider(getRepositoryToken(GenreEntity))
    .useValue(genreRepositoryMock)
}

const getTracksEmpty = () => {
  trackRepositoryMock.findAndCount?.mockImplementation(() => Promise.resolve([[], 0]))
}

const getTracksSuccess = () => {
  trackRepositoryMock.findAndCount?.mockImplementation(() => Promise.resolve([[trackFactory()], 1]))
}

export const tracks = {
  getTracksEmpty,
  getTracksSuccess,
}
