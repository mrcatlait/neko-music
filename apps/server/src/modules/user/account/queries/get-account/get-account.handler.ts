import { Injectable, NotFoundException } from '@nestjs/common'

import { GetAccountQuery } from './get-account.query'

import { UserAccountRepository } from '@modules/user/shared/repositories'
import { QueryHandler } from '@modules/shared/models'
import { UserAccountEntity } from '@modules/user/shared/entities'

@Injectable()
export class GetAccountHandler implements QueryHandler<GetAccountQuery, UserAccountEntity> {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async handle(query: GetAccountQuery): Promise<UserAccountEntity> {
    const userAccount = await this.userAccountRepository.getById(query.userId)

    if (!userAccount) {
      throw new NotFoundException('User account not found')
    }

    return userAccount
  }
}
