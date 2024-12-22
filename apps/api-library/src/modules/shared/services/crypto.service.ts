import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { compareSync, hashSync } from 'bcrypt'

import { EnvironmentVariables } from '../models'

@Injectable()
export class CryptoService {
  private readonly saltRounds: number

  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {
    this.saltRounds = this.configService.get('SALT_ROUNDS')
  }

  generateHash(password: string): string {
    return hashSync(password, this.saltRounds)
  }

  compareHash(password: string, hash: string): boolean {
    return compareSync(password, hash)
  }
}
