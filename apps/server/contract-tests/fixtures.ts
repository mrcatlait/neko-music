import { TestingModuleBuilder } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { repositoryMockFactory } from 'contract-tests/utils'
import { artistFactory, trackFactory } from 'contract-tests/factories'
import { ArtistEntity, ArtistImageEntity } from '@modules/artist/entities'
import { TrackEntity, TrackImageEntity, TrackArtistEntity, GenreEntity } from '@modules/track/entities'
import { AuthGuard } from '@modules/authentication/guards'

const trackRepositoryMock = repositoryMockFactory<TrackEntity>()
const trackImageRepositoryMock = repositoryMockFactory<TrackImageEntity>()
const trackArtistRepositoryMock = repositoryMockFactory<TrackArtistEntity>()
const genreRepositoryMock = repositoryMockFactory<GenreEntity>()

const artistRepositoryMock = repositoryMockFactory<ArtistEntity>()
const artistImageRepositoryMock = repositoryMockFactory<ArtistImageEntity>()

const authGuardMock = {
  canActivate: vi.fn(),
}

export const registerMocks = (builder: TestingModuleBuilder): TestingModuleBuilder => {
  return (
    builder
      // Repositories
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
      // Other
      .overrideProvider(AuthGuard)
      .useValue(authGuardMock)
  )
}

const getTracksEmpty = () => {
  trackRepositoryMock.findAndCount?.mockImplementation(() => Promise.resolve([[], 0]))
}

const getTracksSuccess = () => {
  trackRepositoryMock.findAndCount?.mockImplementation(() => Promise.resolve([[trackFactory()], 1]))
}

const getArtistSuccess = () => {
  artistRepositoryMock.findOne?.mockImplementation(() => Promise.resolve(artistFactory()))
  artistRepositoryMock.existsBy?.mockImplementation(() => Promise.resolve(true))
}

const authenticatedUser = () => {
  authGuardMock.canActivate.mockImplementation(() => Promise.resolve(true))
}

export const auth = {
  authenticatedUser,
}

export const tracks = {
  getTracksEmpty,
  getTracksSuccess,
}

export const artists = {
  getArtistSuccess,
}
