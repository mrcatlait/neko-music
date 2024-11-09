import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'

import { ConfigService } from './config.service'

@Injectable()
export class CryptoService {
  private readonly pepper = this.configService.get('PASSWORD_PEPPER')
  private readonly saltRounds = this.configService.get('USER_PASSWORD_SALT_ROUNDS')

  constructor(private readonly configService: ConfigService) {}

  async generateHash(password: string): Promise<string> {
    const pepperedPassword = this.addPepper(password)
    const salt = await bcrypt.genSalt(this.saltRounds)
    const hash = await bcrypt.hash(pepperedPassword, salt)

    return hash
  }

  compareHash(password: string, hash: string): boolean {
    const pepperedPassword = this.addPepper(password)
    return bcrypt.compareSync(pepperedPassword, hash)
  }

  private addPepper(password: string): string {
    return `${password}${this.pepper}`
  }
}
