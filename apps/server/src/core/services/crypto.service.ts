import { ConfigService } from '@common/services'

export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  private readonly pepper = this.configService.get('PASSWORD_PEPPER')

  generateHash(password: string): string {
    const pepperedPassword = this.addPepper(password)
    return Bun.password.hashSync(pepperedPassword)
  }

  compareHash(password: string, hash: string): boolean {
    const pepperedPassword = this.addPepper(password)
    return Bun.password.verifySync(pepperedPassword, hash)
  }

  private addPepper(password: string): string {
    return `${password}${this.pepper}`
  }
}
