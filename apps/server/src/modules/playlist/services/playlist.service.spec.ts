import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { NotFoundException } from '@nestjs/common'

import { PlaylistService } from './playlist.service'
import { PlaylistEntity, PlaylistTrackEntity } from '../entities'
import { PlaylistPageOptionsDto, CreatePlaylistDto } from '../dto'

import { UserAccountEntity } from '@modules/user/entities'
import { UserModel } from '@modules/authorization/models'

describe('PlaylistService', () => {
  let playlistService: PlaylistService
  let playlistRepositoryMock: PartiallyMocked<Repository<PlaylistEntity>>
  let playlistTrackRepositoryMock: PartiallyMocked<Repository<PlaylistTrackEntity>>

  beforeEach(async () => {
    playlistRepositoryMock = {
      findAndCount: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      findOne: vi.fn(),
      delete: vi.fn(),
    }

    playlistTrackRepositoryMock = {
      insert: vi.fn(),
      delete: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        PlaylistService,
        {
          provide: getRepositoryToken(PlaylistEntity),
          useValue: playlistRepositoryMock,
        },
        {
          provide: getRepositoryToken(PlaylistTrackEntity),
          useValue: playlistTrackRepositoryMock,
        },
      ],
    }).compile()

    playlistService = module.get(PlaylistService)
  })

  describe('getPlaylists', () => {
    it('should return a page of playlists', async () => {
      // Arrange
      const mockUser = new UserAccountEntity()
      Object.assign(mockUser, { id: '1' })
      const firstPlaylist = new PlaylistEntity()
      Object.assign(firstPlaylist, { id: '1', name: 'First Playlist', tracks: [] })
      const secondPlaylist = new PlaylistEntity()
      Object.assign(secondPlaylist, { id: '2', name: 'Second Playlist', tracks: [] })
      const mockPlaylists = [firstPlaylist, secondPlaylist]
      const mockCount = 2
      playlistRepositoryMock.findAndCount?.mockResolvedValue([mockPlaylists, mockCount])
      const pageOptionsDto = new PlaylistPageOptionsDto()

      // Act
      const result = await playlistService.getPlaylists(mockUser, pageOptionsDto)

      // Assert
      expect(result).toBeDefined()
      expect(result.data).toHaveLength(2)
      expect(result.meta).toBeDefined()
      expect(result.meta.itemCount).toBe(2)
    })
  })

  describe('createPlaylist', () => {
    it('should create a new playlist', async () => {
      // Arrange
      const mockUser: UserModel = { user: { id: '1' } } as UserModel
      const createPlaylistDto: CreatePlaylistDto = { name: 'New Playlist', isPublic: true }
      const mockPlaylist = new PlaylistEntity()
      Object.assign(mockPlaylist, { id: '1', name: 'New Playlist', tracks: [] })
      playlistRepositoryMock.create?.mockReturnValue(mockPlaylist)
      playlistRepositoryMock.save?.mockResolvedValue(mockPlaylist)

      // Act
      const result = await playlistService.createPlaylist(mockUser, createPlaylistDto)

      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBe('1')
      expect(result.name).toBe('New Playlist')
    })
  })

  describe('searchPlaylist', () => {
    it('should return a playlist when found', async () => {
      // Arrange
      const mockPlaylist = new PlaylistEntity()
      Object.assign(mockPlaylist, { id: '1', name: 'Test Playlist', tracks: [] })
      playlistRepositoryMock.findOne?.mockResolvedValue(mockPlaylist)

      // Act
      const result = await playlistService.searchPlaylist('1')

      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBe('1')
      expect(result.name).toBe('Test Playlist')
    })

    it('should throw NotFoundException when playlist is not found', async () => {
      // Arrange
      playlistRepositoryMock.findOne?.mockResolvedValue(null)

      // Act & Assert
      await expect(playlistService.searchPlaylist('1')).rejects.toThrow(NotFoundException)
    })
  })

  describe('updatePlaylist', () => {
    it('should update a playlist', async () => {
      // Arrange
      const mockUser: UserModel = { user: { id: '1' } } as UserModel
      const mockPlaylist = new PlaylistEntity()
      Object.assign(mockPlaylist, { id: '1', name: 'Test Playlist', tracks: [] })
      playlistRepositoryMock.findOne?.mockResolvedValue(mockPlaylist)
      playlistRepositoryMock.create?.mockReturnValue(mockPlaylist)
      playlistRepositoryMock.save?.mockResolvedValue(mockPlaylist)

      // Act
      const result = await playlistService.updatePlaylist(mockUser, '1', { name: 'Updated Playlist' })

      // Assert
      expect(result).toBeUndefined()
      expect(playlistRepositoryMock.save).toHaveBeenCalledWith(mockPlaylist)
    })
  })

  describe('deletePlaylist', () => {
    it('should delete a playlist', async () => {
      // Arrange
      const mockUser: UserModel = { user: { id: '1' } } as UserModel
      const mockPlaylist = new PlaylistEntity()
      Object.assign(mockPlaylist, { id: '1', name: 'Test Playlist', tracks: [] })
      playlistRepositoryMock.findOne?.mockResolvedValue(mockPlaylist)
      playlistRepositoryMock.delete?.mockResolvedValue({ affected: 1, raw: [] })

      // Act
      const result = await playlistService.deletePlaylist(mockUser, '1')

      // Assert
      expect(result).toBeUndefined()
      expect(playlistRepositoryMock.delete).toHaveBeenCalledWith('1')
    })
  })

  describe('addTracksToPlaylist', () => {
    it('should add tracks to a playlist', async () => {
      // Arrange
      const mockUser: UserModel = { user: { id: '1' } } as UserModel
      const mockPlaylist = new PlaylistEntity()
      Object.assign(mockPlaylist, { id: '1', name: 'Test Playlist', tracks: [] })
      playlistRepositoryMock.findOne?.mockResolvedValue(mockPlaylist)
      playlistTrackRepositoryMock.insert?.mockResolvedValue({ raw: [], identifiers: [], generatedMaps: [] })

      // Act
      const result = await playlistService.addTracksToPlaylist(mockUser, '1', { tracks: ['1', '2'] })

      // Assert
      expect(result).toBeUndefined()
      expect(playlistTrackRepositoryMock.insert).toHaveBeenCalledWith([
        { playlistId: '1', trackId: '1' },
        { playlistId: '1', trackId: '2' },
      ])
    })
  })

  describe('removeTracksFromPlaylist', () => {
    it('should remove tracks from a playlist', async () => {
      // Arrange
      const mockUser: UserModel = { user: { id: '1' } } as UserModel
      const mockPlaylist = new PlaylistEntity()
      Object.assign(mockPlaylist, { id: '1', name: 'Test Playlist', tracks: [] })
      playlistRepositoryMock.findOne?.mockResolvedValue(mockPlaylist)
      playlistTrackRepositoryMock.delete?.mockResolvedValue({ affected: 1, raw: [] })

      // Act
      const result = await playlistService.removeTracksFromPlaylist(mockUser, '1', { tracks: ['1', '2'] })

      // Assert
      expect(result).toBeUndefined()
      expect(playlistTrackRepositoryMock.delete).toHaveBeenCalledWith({ playlistId: '1', trackId: In(['1', '2']) })
    })
  })
})
