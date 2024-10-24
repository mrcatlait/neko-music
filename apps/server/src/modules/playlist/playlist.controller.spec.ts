import { Test, TestingModule } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'

import { PlaylistController } from './playlist.controller'
import { PlaylistService } from './playlist.service'
import { CreatePlaylistDto, PlaylistDto, PlaylistPageDto } from './dto'
import { PlaylistType } from './constants'

import { UserAccountEntity } from '@modules/user/entities'
import { UserModel } from '@modules/authorization/models'

describe('PlaylistController', () => {
  let controller: PlaylistController
  let playlistServiceMock: PartiallyMocked<PlaylistService>

  beforeEach(async () => {
    playlistServiceMock = {
      getPlaylists: vi.fn(),
      searchPlaylist: vi.fn(),
      createPlaylist: vi.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistController],
      providers: [
        {
          provide: PlaylistService,
          useValue: playlistServiceMock,
        },
      ],
    }).compile()

    controller = module.get<PlaylistController>(PlaylistController)
  })

  describe('userPlaylists', () => {
    it('should return user playlists', async () => {
      // Arrange
      const user: UserAccountEntity = { id: '1', username: 'testuser' } as UserAccountEntity
      const expectedResult: PlaylistPageDto = {
        data: [{ id: '1', name: 'Test Playlist', type: PlaylistType.PUBLIC, tracks: [] }],
        meta: { offset: 0, take: 50, itemCount: 1, pageCount: 1 },
      }
      playlistServiceMock.getPlaylists?.mockResolvedValue(expectedResult)

      // Act
      const result = await controller.userPlaylists(user)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(playlistServiceMock.getPlaylists).toHaveBeenCalledWith(user, { offset: 0, take: 50 })
    })
  })

  describe('getPlaylistById', () => {
    it('should return a playlist by id', async () => {
      // Arrange
      const playlistId = '1'
      const expectedResult: PlaylistDto = { id: '1', name: 'Test Playlist', type: PlaylistType.PUBLIC, tracks: [] }
      playlistServiceMock.searchPlaylist?.mockResolvedValue(expectedResult)

      // Act
      const result = await controller.getPlaylistById(playlistId)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(playlistServiceMock.searchPlaylist).toHaveBeenCalledWith(playlistId)
    })
  })

  describe('createPlaylist', () => {
    it('should create a new playlist', async () => {
      // Arrange
      const user: UserModel = { user: { id: '1', username: 'testuser' }, permissions: [] }
      const input: CreatePlaylistDto = { name: 'New Playlist', type: PlaylistType.PUBLIC }
      const expectedResult: PlaylistDto = { id: '2', name: 'New Playlist', type: PlaylistType.PUBLIC, tracks: [] }
      playlistServiceMock.createPlaylist?.mockResolvedValue(expectedResult)

      // Act
      const result = await controller.createPlaylist(user, input)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(playlistServiceMock.createPlaylist).toHaveBeenCalledWith(user, input)
    })
  })
})
