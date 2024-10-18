import { Injectable } from '@nestjs/common'

import { CryptoService } from './crypto.service'
import { UserLoginDto } from '../dto'

import { UserLoginDataService } from '@modules/user/services'
import { UserAccountEntity } from '@modules/user/entities'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userLoginDataService: UserLoginDataService,
    private readonly cryptoService: CryptoService,
  ) {}

  async validateUser(payload: UserLoginDto): Promise<UserAccountEntity | null> {
    try {
      const userLoginData = await this.userLoginDataService.findByEmail(payload.email)

      if (!userLoginData) {
        return null
      }

      const isMatch = this.cryptoService.compareHash(payload.password, userLoginData.passwordHash)

      if (isMatch) {
        return userLoginData.userAccount
      }
    } catch {
      return null
    }

    return null
  }
}

// const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
