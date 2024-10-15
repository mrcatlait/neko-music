import { Injectable } from '@nestjs/common'

import { AuthRefreshTokenService } from './auth-refresh-token.service'
import { CryptoService } from './crypto.service'

import { UserLoginDataService } from 'src/modules/user/services'
import { UserAccountEntity } from 'src/modules/user/entities'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userLoginDataService: UserLoginDataService,
    private readonly cryptoService: CryptoService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserAccountEntity | null> {
    try {
      const userLoginData = await this.userLoginDataService.findByEmail(email)

      if (!userLoginData) {
        return null
      }

      const isMatch = this.cryptoService.compareHash(password, userLoginData.passwordHash)

      if (isMatch) {
        return userLoginData.userAccount
      }
    } catch {
      return null
    }

    return null
  }

  login(user: UserAccountEntity) {
    return this.authRefreshTokenService.generateTokenPair(user)
  }
}
