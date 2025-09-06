import { Injectable, UnauthorizedException } from '@nestjs/common'

import { PermissionRepository, RefreshTokenRepository } from '../../repositories'
import { AuthService, JwtService } from '../../services'

export interface RefreshTokenUseCaseParams {
  readonly token: string
}

export interface RefreshTokenUseCaseResult {
  readonly accessToken: string
  readonly refreshToken: string
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async invoke(params: RefreshTokenUseCaseParams): Promise<RefreshTokenUseCaseResult> {
    try {
      await this.jwtService.verifyRefreshToken(params.token)

      const refreshToken = await this.refreshTokenRepository.findOneByToken(params.token)

      if (!refreshToken) {
        throw new UnauthorizedException()
      }

      const permissions = await this.permissionRepository.findByUserId(refreshToken.userId)

      const scopes = permissions.map((permission) => permission.name)

      const { accessToken, refreshToken: newRefreshToken } = await this.authService.generateTokenPair({
        userId: refreshToken.userId,
        scopes,
      })

      return {
        accessToken,
        refreshToken: newRefreshToken,
      }
    } catch {
      throw new UnauthorizedException()
    } finally {
      await this.refreshTokenRepository.deleteByToken(params.token)
    }
  }
}
