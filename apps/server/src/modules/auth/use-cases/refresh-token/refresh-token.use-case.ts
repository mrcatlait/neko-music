import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthRepository } from '../../repositories'
import { AuthService, JwtService } from '../../services'

import { UseCase } from '@/modules/shared/interfaces'

export interface RefreshTokenUseCaseParams {
  readonly token: string
}

export interface RefreshTokenUseCaseResult {
  readonly accessToken: string
  readonly refreshToken: string
}

@Injectable()
export class RefreshTokenUseCase implements UseCase<RefreshTokenUseCaseParams, RefreshTokenUseCaseResult> {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async invoke(params: RefreshTokenUseCaseParams): Promise<RefreshTokenUseCaseResult> {
    try {
      await this.jwtService.verifyRefreshToken(params.token)

      const refreshToken = await this.authRepository.findRefreshTokenByToken(params.token)

      if (!refreshToken) {
        throw new UnauthorizedException()
      }

      const account = await this.authRepository.findAccountById(refreshToken.userId)

      if (!account) {
        throw new UnauthorizedException()
      }

      const { accessToken, refreshToken: newRefreshToken } = await this.authService.generateTokenPair({
        userId: refreshToken.userId,
        role: account.role,
      })

      return {
        accessToken,
        refreshToken: newRefreshToken,
      }
    } catch {
      throw new UnauthorizedException()
    } finally {
      await this.authRepository.deleteRefreshTokenByToken(params.token)
    }
  }
}
