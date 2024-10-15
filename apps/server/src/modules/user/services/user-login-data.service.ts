import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { genSaltSync, hashSync } from 'bcrypt'

import { UserLoginDataEntity } from '../entities'

import { ConfigService } from '@core/services'

@Injectable()
export class UserLoginDataService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserLoginDataEntity)
    private readonly userLoginDataRepository: Repository<UserLoginDataEntity>,
  ) {}

  createUserLoginDataEntity(userId: string, email: string, password: string): UserLoginDataEntity {
    const passwordSalt = genSaltSync(this.configService.get('USER_PASSWORD_BCRYPT_SALT_ROUNDS'))
    const passwordHash = hashSync(password, passwordSalt)

    return this.userLoginDataRepository.create({
      userId,
      email,
      passwordHash,
      passwordSalt,
    })
  }

  findByEmail(email: string): Promise<UserLoginDataEntity | null> {
    return this.userLoginDataRepository.findOne({ where: { email }, relations: { userAccount: true } })
  }
}
