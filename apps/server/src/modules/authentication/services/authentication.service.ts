import { Injectable } from '@nestjs/common'

import { LoginPayloadDto, UserLoginDto, UserRegisterDto } from '../dto'

import { UserLoginDataService, UserAccountService } from '@modules/user/services'
import { UserAccountEntity } from '@modules/user/entities'
import { CryptoService } from '@shared/services'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userLoginDataService: UserLoginDataService,
    private readonly userAccountService: UserAccountService,
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

  async register(input: UserRegisterDto): Promise<LoginPayloadDto> {
    const userAccount = await this.userAccountService.createUserAccount(input.username, input.email, input.password)

    return new LoginPayloadDto(userAccount)
  }
}
