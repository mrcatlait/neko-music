import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, InsertResult } from 'typeorm'
import { Permission } from '@neko/permissions'

import { RoleService } from './role.service'
import { UserRoleEntity } from '../entities'

describe('RoleService', () => {
  let roleService: RoleService
  let roleRepositoryMock: PartiallyMocked<Repository<UserRoleEntity>>

  beforeEach(async () => {
    roleRepositoryMock = {
      find: vi.fn(),
      insert: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(UserRoleEntity),
          useValue: roleRepositoryMock,
        },
      ],
    }).compile()

    roleService = module.get(RoleService)
  })

  describe('getRoles', () => {
    it('should return an array of roles with permissions', async () => {
      // Arrange
      const mockRoles: UserRoleEntity[] = [
        {
          id: '1',
          name: 'Admin',
          description: 'Admin role',
          permissions: [{ id: '1', action: Permission.TrackCreate, description: 'Create track', roles: [] }],
        },
        {
          id: '2',
          name: 'User',
          description: 'User role',
          permissions: [{ id: '2', action: Permission.TrackRead, description: 'Read track', roles: [] }],
        },
      ]
      roleRepositoryMock.find?.mockResolvedValue(mockRoles)

      // Act
      const result = await roleService.getRoles()

      // Assert
      expect(result).toBeDefined()
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Admin')
      expect(result[0].permissions).toHaveLength(1)
      expect(result[1].name).toBe('User')
      expect(result[1].permissions).toHaveLength(1)
      expect(roleRepositoryMock.find).toHaveBeenCalledWith({ relations: { permissions: true } })
    })
  })

  describe('createRole', () => {
    it('should create a new role', async () => {
      // Arrange
      const name = 'New Role'
      const description = 'Description for new role'
      const mockInsertResult: InsertResult = {
        identifiers: [{ id: '3' }],
        generatedMaps: [{ id: '3', name, description }],
        raw: [],
      }
      roleRepositoryMock.insert?.mockResolvedValue(mockInsertResult)

      // Act
      const result = await roleService.createRole(name, description)

      // Assert
      expect(result).toBeDefined()
      expect(result.identifiers[0].id).toBe('3')
      expect(roleRepositoryMock.insert).toHaveBeenCalledWith({ name, description })
    })

    it('should create a new role without description', async () => {
      // Arrange
      const name = 'New Role'
      const mockInsertResult: InsertResult = {
        identifiers: [{ id: '4' }],
        generatedMaps: [{ id: '4', name }],
        raw: [],
      }
      roleRepositoryMock.insert?.mockResolvedValue(mockInsertResult)

      // Act
      const result = await roleService.createRole(name)

      // Assert
      expect(result).toBeDefined()
      expect(result.identifiers[0].id).toBe('4')
      expect(roleRepositoryMock.insert).toHaveBeenCalledWith({ name, description: undefined })
    })
  })
})
