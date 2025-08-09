import { Injectable } from '@nestjs/common'
import { compareSync, hashSync } from 'bcrypt'

import { ConfigService } from '@/modules/config/services'

@Injectable()
export class CryptoService {
  private readonly saltRounds: number

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = this.configService.config.SALT_ROUNDS
  }

  generateHash(password: string): string {
    return hashSync(password, this.saltRounds)
  }

  compareHash(password: string, hash: string): boolean {
    return compareSync(password, hash)
  }
}
