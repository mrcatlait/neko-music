import { Injectable } from '@nestjs/common'

import { UserLoginDto } from '../dto'

import { UserLoginDataService } from '@modules/user/services'
import { UserAccountEntity } from '@modules/user/entities'
import { CryptoService } from '@shared/services'

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
