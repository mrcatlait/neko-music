import { Injectable } from '@nestjs/common'

import { UserLoginDataEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class UserLoginDataRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findOneByEmail(email: string): Promise<UserLoginDataEntity | undefined> {
    return this.databaseService.sql`
      ${this.selectFragment}
      WHERE email = ${email} LIMIT 1
    `.then((result) => result[0] as UserLoginDataEntity | undefined)
  }

  private readonly selectFragment = this.databaseService.sql`
    SELECT u.*
    FROM "UserLoginData" u
  `
}
