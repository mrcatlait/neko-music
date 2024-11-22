import { UserRepository } from '../repositories'
import { User } from '../models'
import { GetUserByEmailQuery } from '../queries'

export class UserQueryService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserByEmail(query: GetUserByEmailQuery): Promise<User | undefined> {
    return this.userRepository.getByEmail(query.email)
  }
}
