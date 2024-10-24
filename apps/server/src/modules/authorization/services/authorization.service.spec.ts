import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { AuthorizationService } from './authorization.service'
import { UserRoleEntity } from '../entities'

describe('AuthorizationService', () => {
  let authorizationService: AuthorizationService
  let userRoleRepositoryMock: PartiallyMocked<Repository<UserRoleEntity>>

  beforeEach(async () => {
    userRoleRepositoryMock = {
      findOneOrFail: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        {
          provide: getRepositoryToken(UserRoleEntity),
          useValue: userRoleRepositoryMock,
        },
      ],
    }).compile()

    authorizationService = module.get(AuthorizationService)
  })

  describe('getRoleById', () => {
    it('should return a user role when found', async () => {
      // Arrange
      const mockUserRole = new UserRoleEntity()
      mockUserRole.id = '1'
      mockUserRole.name = 'Admin'
      mockUserRole.permissions = []
      userRoleRepositoryMock.findOneOrFail?.mockResolvedValue(mockUserRole)

      // Act
      const result = await authorizationService.getRoleById('1')

      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBe('1')
      expect(result.name).toBe('Admin')
      expect(result.permissions).toEqual([])
      expect(userRoleRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: { permissions: true },
      })
    })

    it('should throw an error when user role is not found', async () => {
      // Arrange
      userRoleRepositoryMock.findOneOrFail?.mockRejectedValue(new Error('User role not found'))

      // Act & Assert
      await expect(authorizationService.getRoleById('1')).rejects.toThrow('User role not found')
    })
  })
})
