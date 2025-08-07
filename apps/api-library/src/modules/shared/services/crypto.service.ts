import { Injectable } from '@nestjs/common'
import { compareSync, hashSync } from 'bcrypt'

import { env } from 'src/env'

@Injectable()
export class CryptoService {
  private readonly saltRounds: number

  constructor() {
    this.saltRounds = env.SALT_ROUNDS
  }

  generateHash(password: string): string {
    return hashSync(password, this.saltRounds)
  }

  compareHash(password: string, hash: string): boolean {
    return compareSync(password, hash)
  }
}
