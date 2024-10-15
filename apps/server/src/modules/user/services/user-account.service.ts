import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { UserAccountEntity, UserLoginDataEntity } from '../entities'
import { UserLoginDataService } from './user-login-data.service'

@Injectable()
export class UserAccountService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserAccountEntity)
    private readonly usersAccountRepository: Repository<UserAccountEntity>,
    private readonly userLoginDataService: UserLoginDataService,
  ) {}

  async createUserAccount(username: string, email: string, password: string): Promise<UserAccountEntity> {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const [usernameTaken, emailTaken] = await Promise.all([
        queryRunner.manager.findOneBy(UserAccountEntity, { username }),
        queryRunner.manager.findOneBy(UserLoginDataEntity, { email }),
      ])

      if (usernameTaken || emailTaken) {
        throw new BadRequestException({ usernameTaken, emailTaken })
      }

      const userAccount = await queryRunner.manager.save(this.usersAccountRepository.create({ username }))
      await queryRunner.manager.save(
        this.userLoginDataService.createUserLoginDataEntity(userAccount.id, email, password),
      )

      await queryRunner.commitTransaction()

      return userAccount
    } catch (error) {
      await queryRunner.rollbackTransaction()

      if (error instanceof BadRequestException) {
        throw error
      }

      throw new InternalServerErrorException()
    } finally {
      await queryRunner.release()
    }
  }

  findById(userId: string): Promise<UserAccountEntity | null> {
    return this.usersAccountRepository.findOne({ where: { id: userId }, relations: { userLoginData: true } })
  }
}
