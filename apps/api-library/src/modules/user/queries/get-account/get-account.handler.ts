import { NotFoundException } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

import { GetAccountQuery } from './get-account.query'

import { UserAccountEntity } from '@modules/user/entities'
import { UserAccountRepository } from '@modules/user/repositories'

@QueryHandler(GetAccountQuery)
export class GetAccountHandler implements IQueryHandler<GetAccountQuery, UserAccountEntity> {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async execute(query: GetAccountQuery): Promise<UserAccountEntity> {
    const userAccount = await this.userAccountRepository.getById(query.userId)

    if (!userAccount) {
      throw new NotFoundException('User account not found')
    }

    return userAccount
  }
}
