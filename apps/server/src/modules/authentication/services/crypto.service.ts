import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'

@Injectable()
export class CryptoService {
  async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)

    return hash
  }

  compareHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
  }
}
