import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, InsertResult } from 'typeorm'
import { Permission } from '@neko/permissions'

import { PermissionService } from './permission.service'
import { PermissionEntity } from '../entities'

describe('PermissionService', () => {
  let permissionService: PermissionService
  let permissionRepositoryMock: PartiallyMocked<Repository<PermissionEntity>>

  beforeEach(async () => {
    permissionRepositoryMock = {
      find: vi.fn(),
      insert: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(PermissionEntity),
          useValue: permissionRepositoryMock,
        },
      ],
    }).compile()

    permissionService = module.get(PermissionService)
  })

  describe('getPermissions', () => {
    it('should return an array of permissions', async () => {
      // Arrange
      const mockPermissions: PermissionEntity[] = [
        { id: '1', action: Permission.TrackRead, description: 'Read permission', roles: [] },
        { id: '2', action: Permission.TrackUpdate, description: 'Write permission', roles: [] },
      ]
      permissionRepositoryMock.find?.mockResolvedValue(mockPermissions)

      // Act
      const result = await permissionService.getPermissions()

      // Assert
      expect(result).toBeDefined()
      expect(result).toHaveLength(2)
      expect(result[0].action).toBe(Permission.TrackRead)
      expect(result[1].action).toBe(Permission.TrackUpdate)
    })

    it('should return an empty array when no permissions are found', async () => {
      // Arrange
      permissionRepositoryMock.find?.mockResolvedValue([])

      // Act
      const result = await permissionService.getPermissions()

      // Assert
      expect(result).toBeDefined()
      expect(result).toHaveLength(0)
    })
  })

  describe('createPermission', () => {
    it('should create a new permission', async () => {
      // Arrange
      const action = 'create'
      const description = 'Create permission'
      const mockInsertResult: InsertResult = {
        identifiers: [{ id: '3' }],
        generatedMaps: [{ id: '3', action, description }],
        raw: [],
      }
      permissionRepositoryMock.insert?.mockResolvedValue(mockInsertResult)

      // Act
      const result = await permissionService.createPermission(action, description)

      // Assert
      expect(result).toBeDefined()
      expect(result.identifiers[0].id).toBe('3')
      expect(permissionRepositoryMock.insert).toHaveBeenCalledWith({ action, description })
    })

    it('should create a permission without description', async () => {
      // Arrange
      const action = 'delete'
      const mockInsertResult: InsertResult = {
        identifiers: [{ id: '4' }],
        generatedMaps: [{ id: '4', action }],
        raw: [],
      }
      permissionRepositoryMock.insert?.mockResolvedValue(mockInsertResult)

      // Act
      const result = await permissionService.createPermission(action)

      // Assert
      expect(result).toBeDefined()
      expect(result.identifiers[0].id).toBe('4')
      expect(permissionRepositoryMock.insert).toHaveBeenCalledWith({ action, description: undefined })
    })
  })
})
