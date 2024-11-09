import { TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StateFuncWithSetup } from '@pact-foundation/pact/src/dsl/verifier/proxy/types'

import { mockedUser } from './mock-session.middleware'

import {
  artistFactory,
  artistImageFactory,
  myPlaylistFactory,
  playlistTrackFactory,
  trackArtistFactory,
  trackFactory,
  trackGenreFactory,
  trackImageFactory,
} from 'contract-tests/factories'
import { ArtistEntity, ArtistImageEntity } from '@modules/artist/entities'
import {
  TrackEntity,
  TrackImageEntity,
  TrackArtistEntity,
  TrackGenreEntity,
  GenreEntity,
} from '@modules/track/entities'
import { UserAccountEntity, UserLoginDataEntity } from '@modules/user/entities'
import { PlaylistEntity, PlaylistTrackEntity } from '@modules/playlist/entities'

let trackRepository: Repository<TrackEntity>
let trackImageRepository: Repository<TrackImageEntity>
let trackArtistRepository: Repository<TrackArtistEntity>
let trackGenreRepository: Repository<TrackGenreEntity>

let genreRepository: Repository<GenreEntity>

let artistRepository: Repository<ArtistEntity>
let artistImageRepository: Repository<ArtistImageEntity>

let userAccountRepository: Repository<UserAccountEntity>
let userLoginDataRepository: Repository<UserLoginDataEntity>

let playlistRepository: Repository<PlaylistEntity>
let playlistTrackRepository: Repository<PlaylistTrackEntity>

export const registerDatabaseMocks = (moduleRef: TestingModule): void => {
  trackRepository = moduleRef.get(getRepositoryToken(TrackEntity))
  trackImageRepository = moduleRef.get(getRepositoryToken(TrackImageEntity))
  trackArtistRepository = moduleRef.get(getRepositoryToken(TrackArtistEntity))
  trackGenreRepository = moduleRef.get(getRepositoryToken(TrackGenreEntity))

  genreRepository = moduleRef.get(getRepositoryToken(GenreEntity))

  artistRepository = moduleRef.get(getRepositoryToken(ArtistEntity))
  artistImageRepository = moduleRef.get(getRepositoryToken(ArtistImageEntity))

  userAccountRepository = moduleRef.get(getRepositoryToken(UserAccountEntity))
  userLoginDataRepository = moduleRef.get(getRepositoryToken(UserLoginDataEntity))

  playlistRepository = moduleRef.get(getRepositoryToken(PlaylistEntity))
  playlistTrackRepository = moduleRef.get(getRepositoryToken(PlaylistTrackEntity))
}

const clearDatabase = async () => {
  await Promise.all([
    trackImageRepository.delete({}),
    trackArtistRepository.delete({}),
    trackGenreRepository.delete({}),
    artistImageRepository.delete({}),
    playlistTrackRepository.delete({}),
    userLoginDataRepository.delete({}),
  ])

  await Promise.all([
    trackRepository.delete({}),
    artistRepository.delete({}),
    userAccountRepository.delete({}),
    playlistRepository.delete({}),
  ])
}

const getTracksEmpty: StateFuncWithSetup = {
  setup: async () => {
    await clearDatabase()
  },
}

const getTracksSuccess: StateFuncWithSetup = {
  setup: async () => {
    const [track, artist, genre] = await Promise.all([
      trackRepository.save(trackFactory()),
      artistRepository.save(artistFactory()),
      genreRepository.findOneByOrFail({ name: 'Rock' }),
    ])

    await Promise.all([
      trackImageRepository.save(trackImageFactory(track)),
      trackArtistRepository.save(trackArtistFactory(track, artist)),
      trackGenreRepository.save(trackGenreFactory(track, genre)),
    ])
  },
  teardown: async () => {
    await clearDatabase()
  },
}

const getArtistSuccess: StateFuncWithSetup = {
  setup: async (params: { id: string }) => {
    const artist = await artistRepository.save(artistFactory(params.id))
    await artistImageRepository.save(artistImageFactory(artist))
  },
  teardown: async () => {
    await clearDatabase()
  },
}

const getArtistTracksSuccess: StateFuncWithSetup = {
  setup: async (params: { id: string }) => {
    const [track, artist, genre] = await Promise.all([
      trackRepository.save(trackFactory()),
      artistRepository.findOneByOrFail({ id: params.id }),
      genreRepository.findOneByOrFail({ name: 'Rock' }),
    ])

    await Promise.all([
      trackImageRepository.save(trackImageFactory(track)),
      trackArtistRepository.save(trackArtistFactory(track, artist)),
      trackGenreRepository.save(trackGenreFactory(track, genre)),
    ])
  },
  teardown: async () => {
    await clearDatabase()
  },
}

const getMyPlaylistSuccess: StateFuncWithSetup = {
  setup: async (params: { id: string }) => {
    await playlistRepository.save(myPlaylistFactory(params.id, mockedUser.user.id))
  },
  teardown: async () => {
    await clearDatabase()
  },
}

const getPlaylistTracksSuccess: StateFuncWithSetup = {
  setup: async (params: { id: string }) => {
    const [track, playlist, genre, artist] = await Promise.all([
      trackRepository.save(trackFactory()),
      playlistRepository.findOneByOrFail({ id: params.id }),
      genreRepository.findOneByOrFail({ name: 'Rock' }),
      artistRepository.save(artistFactory()),
    ])

    await Promise.all([
      playlistTrackRepository.save(playlistTrackFactory(playlist, track)),
      trackArtistRepository.save(trackArtistFactory(track, artist)),
      trackGenreRepository.save(trackGenreFactory(track, genre)),
    ])
  },
  teardown: async () => {
    await clearDatabase()
  },
}

export const tracks = {
  getTracksEmpty,
  getTracksSuccess,
}

export const artists = {
  getArtistSuccess,
  getArtistTracksSuccess,
}

export const playlists = {
  getMyPlaylistSuccess,
  getPlaylistTracksSuccess,
}
