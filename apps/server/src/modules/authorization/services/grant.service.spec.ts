import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, InsertResult } from 'typeorm'

import { GrantService } from './grant.service'
import { GrantedPermissionEntity } from '../entities'

describe('GrantService', () => {
  let grantService: GrantService
  let grantedPermissionRepositoryMock: PartiallyMocked<Repository<GrantedPermissionEntity>>

  beforeEach(async () => {
    grantedPermissionRepositoryMock = {
      insert: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        GrantService,
        {
          provide: getRepositoryToken(GrantedPermissionEntity),
          useValue: grantedPermissionRepositoryMock,
        },
      ],
    }).compile()

    grantService = module.get(GrantService)
  })

  describe('createRolePermission', () => {
    it('should create a role permission successfully', async () => {
      // Arrange
      const roleId = 'role-123'
      const permissionId = 'permission-456'
      const mockInsertResult: InsertResult = {
        identifiers: [{ id: 1 }],
        generatedMaps: [{ id: 1 }],
        raw: { id: 1 },
      }
      grantedPermissionRepositoryMock.insert?.mockResolvedValue(mockInsertResult)

      // Act
      const result = await grantService.createRolePermission(roleId, permissionId)

      // Assert
      expect(result).toBeDefined()
      expect(result).toEqual(mockInsertResult)
      expect(grantedPermissionRepositoryMock.insert).toHaveBeenCalledWith({ roleId, permissionId })
    })

    it('should throw an error if insertion fails', async () => {
      // Arrange
      const roleId = 'role-123'
      const permissionId = 'permission-456'
      const mockError = new Error('Insertion failed')
      grantedPermissionRepositoryMock.insert?.mockRejectedValue(mockError)

      // Act & Assert
      await expect(grantService.createRolePermission(roleId, permissionId)).rejects.toThrow('Insertion failed')
    })
  })
})
