import { Injectable } from '@nestjs/common'

@Injectable()
export class ConfigService<T extends Record<string, unknown>> {
  get(key: keyof T): T[keyof T] {}
}
