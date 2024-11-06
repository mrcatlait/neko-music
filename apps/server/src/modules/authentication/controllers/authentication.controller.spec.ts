import { Test, TestingModule } from '@nestjs/testing'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedException } from '@nestjs/common'
import { describe, it, expect, beforeEach, PartiallyMocked } from 'vitest'

import { AuthenticationController } from './authentication.controller'
import { AuthenticationService } from '../services'
import { UserLoginDto, LoginPayloadDto, UserRegisterDto } from '../dto'

import { UserModel } from '@modules/authorization/models'
import { UserAccountEntity } from '@modules/user/entities'

describe('AuthenticationController', () => {
  let controller: AuthenticationController
  let authenticationServiceMock: PartiallyMocked<AuthenticationService>

  beforeEach(async () => {
    authenticationServiceMock = {
      validateUser: vi.fn(),
      register: vi.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authenticationServiceMock,
        },
      ],
    }).compile()

    controller = module.get<AuthenticationController>(AuthenticationController)
  })

  describe('login', () => {
    it('should return LoginPayloadDto and set session when login is successful', async () => {
      // Arrange
      const mockUserEntity = new UserAccountEntity()
      Object.assign(mockUserEntity, { id: '1', username: 'testuser', role: { permissions: [] } })
      const mockInput: UserLoginDto = { email: 'testuser', password: 'password' }
      const mockRequest = {
        session: {
          set: vi.fn(),
          save: vi.fn(),
        },
      } as unknown as FastifyRequest

      authenticationServiceMock.validateUser?.mockResolvedValue(mockUserEntity)

      // Act
      const result = await controller.login(mockRequest, mockInput)

      // Assert
      expect(result).toBeInstanceOf(LoginPayloadDto)
      expect(result.user.id).toEqual(mockUserEntity.id)
      expect(mockRequest.session.set).toHaveBeenCalledWith('data', expect.any(LoginPayloadDto))
      expect(mockRequest.session.save).toHaveBeenCalled()
    })

    it('should throw UnauthorizedException when login fails', async () => {
      // Arrange
      const mockInput: UserLoginDto = { email: 'testuser', password: 'wrongpassword' }
      const mockRequest = {} as FastifyRequest

      authenticationServiceMock.validateUser?.mockResolvedValue(null)

      // Act & Assert
      await expect(controller.login(mockRequest, mockInput)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('logout', () => {
    it('should destroy the session', async () => {
      // Arrange
      const mockRequest = {
        session: {
          destroy: vi.fn().mockResolvedValue(undefined),
        },
      } as unknown as FastifyRequest

      // Act
      await controller.logout(mockRequest)

      // Assert
      expect(mockRequest.session.destroy).toHaveBeenCalled()
    })
  })

  describe('whoami', () => {
    it('should return LoginPayloadDto, regenerate session, and set cache control header', async () => {
      // Arrange
      const mockUserModel = { user: { id: '1', username: 'testuser' } } as UserModel
      const mockRequest = {
        session: {
          regenerate: vi.fn().mockResolvedValue(undefined),
          save: vi.fn().mockResolvedValue(undefined),
        },
      } as unknown as FastifyRequest
      const mockResponse = {
        header: vi.fn(),
      } as unknown as FastifyReply

      // Act
      const result = await controller.whoami(mockRequest, mockResponse, mockUserModel)

      // Assert
      expect(result.user.id).toEqual(mockUserModel.user.id)
      expect(mockResponse.header).toHaveBeenCalledWith('Cache-Control', 'no-store')
      expect(mockRequest.session.regenerate).toHaveBeenCalledWith(['user'])
      expect(mockRequest.session.save).toHaveBeenCalled()
    })
  })

  describe('register', () => {
    it('should successfully register a new user and return LoginPayloadDto', async () => {
      // Arrange
      const mockUserEntity = new UserAccountEntity()
      Object.assign(mockUserEntity, {
        id: '1',
        username: 'newuser',
        email: 'newuser@example.com',
        role: { permissions: [] },
      })

      const mockInput: UserRegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
      }

      const expectedLoginPayload = new LoginPayloadDto(mockUserEntity)

      authenticationServiceMock.register?.mockResolvedValue(expectedLoginPayload)

      // Act
      const result = await controller.register(mockInput)

      // Assert
      expect(authenticationServiceMock.register).toHaveBeenCalledWith(mockInput)
      expect(result).toBeInstanceOf(LoginPayloadDto)
      expect(result).toEqual(expectedLoginPayload)
    })

    it('should pass through any errors from the authentication service', async () => {
      // Arrange
      const mockInput: UserRegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        username: 'existinguser',
      }

      const mockError = new Error('User already exists')

      authenticationServiceMock.register?.mockRejectedValue(mockError)

      // Act & Assert
      await expect(controller.register(mockInput)).rejects.toThrow(mockError)
    })
  })
})
