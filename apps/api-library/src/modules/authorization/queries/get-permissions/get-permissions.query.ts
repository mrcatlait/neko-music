import { Query } from '@nestjs/cqrs'

export class GetPermissionsQuery extends Query<string[]> {
  constructor(readonly userId: string) {
    super()
  }
}
