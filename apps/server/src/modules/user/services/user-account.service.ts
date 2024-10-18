import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserAccountEntity, UserLoginDataEntity } from '../entities'
import { UserLoginDataService } from './user-login-data.service'

import { UserRoleEntity } from '@modules/authorization/entities'

@Injectable()
export class UserAccountService {
  private readonly logger = new Logger(UserAccountService.name)

  constructor(
    @InjectRepository(UserAccountEntity)
    private readonly usersAccountRepository: Repository<UserAccountEntity>,
    private readonly userLoginDataService: UserLoginDataService,
  ) {}

  async createUserAccount(
    username: string,
    email: string,
    password: string,
    roleName: string,
  ): Promise<UserAccountEntity> {
    return this.usersAccountRepository.manager.transaction(async (manager) => {
      const role = await manager.findOne(UserRoleEntity, { where: { name: roleName } })

      if (!role) {
        this.logger.error(`Failed to find role with name "${roleName}"`)
        throw new InternalServerErrorException()
      }

      const [usernameTaken, emailTaken] = await Promise.all([
        manager.findOneBy(UserAccountEntity, { username }),
        manager.findOneBy(UserLoginDataEntity, { email }),
      ])

      if (usernameTaken || emailTaken) {
        throw new BadRequestException({ usernameTaken, emailTaken })
      }

      const userAccount = await manager.save(this.usersAccountRepository.create({ username, role }))

      await manager.save(this.userLoginDataService.createUserLoginDataEntity(userAccount.id, email, password))

      return userAccount
    })
  }

  findById(userId: string): Promise<UserAccountEntity | null> {
    return this.usersAccountRepository.findOne({ where: { id: userId }, relations: { userLoginData: true } })
  }
}
