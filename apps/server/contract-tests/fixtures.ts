import { TestingModuleBuilder } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { GenreEntity, TrackArtistEntity, TrackEntity, TrackImageEntity } from '@features/track/entities'
import { repositoryMockFactory } from 'contract-tests/utils'
import { artistFactory, trackFactory } from 'contract-tests/factories'
import { ArtistEntity, ArtistImageEntity } from '@features/artist/entities'

const trackRepositoryMock = repositoryMockFactory<TrackEntity>()
const trackImageRepositoryMock = repositoryMockFactory<TrackImageEntity>()
const trackArtistRepositoryMock = repositoryMockFactory<TrackArtistEntity>()
const genreRepositoryMock = repositoryMockFactory<GenreEntity>()

const artistRepositoryMock = repositoryMockFactory<ArtistEntity>()
const artistImageRepositoryMock = repositoryMockFactory<ArtistImageEntity>()

export const registerRepositories = (builder: TestingModuleBuilder): TestingModuleBuilder => {
  return builder
    .overrideProvider(getRepositoryToken(TrackEntity))
    .useValue(trackRepositoryMock)
    .overrideProvider(getRepositoryToken(TrackImageEntity))
    .useValue(trackImageRepositoryMock)
    .overrideProvider(getRepositoryToken(TrackArtistEntity))
    .useValue(trackArtistRepositoryMock)
    .overrideProvider(getRepositoryToken(GenreEntity))
    .useValue(genreRepositoryMock)
    .overrideProvider(getRepositoryToken(ArtistEntity))
    .useValue(artistRepositoryMock)
    .overrideProvider(getRepositoryToken(ArtistImageEntity))
    .useValue(artistImageRepositoryMock)
}

const getTracksEmpty = () => {
  trackRepositoryMock.findAndCount?.mockImplementation(() => Promise.resolve([[], 0]))
}

const getTracksSuccess = () => {
  trackRepositoryMock.findAndCount?.mockImplementation(() => Promise.resolve([[trackFactory()], 1]))
}

const getArtistSuccess = () => {
  artistRepositoryMock.findOne?.mockImplementation(() => Promise.resolve(artistFactory()))
}

const getArtistTracksSuccess = () => {
  artistRepositoryMock.existsBy?.mockImplementation(() => Promise.resolve(true))
  trackRepositoryMock.findAndCount?.mockImplementation(() => Promise.resolve([[trackFactory()], 1]))
}

export const tracks = {
  getTracksEmpty,
  getTracksSuccess,
}

export const artists = {
  getArtistSuccess,
  getArtistTracksSuccess,
}
