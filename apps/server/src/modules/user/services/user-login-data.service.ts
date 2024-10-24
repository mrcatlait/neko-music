import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserLoginDataEntity } from '../entities'

import { CryptoService } from '@shared/services'

@Injectable()
export class UserLoginDataService {
  constructor(
    private readonly cryptoService: CryptoService,
    @InjectRepository(UserLoginDataEntity)
    private readonly userLoginDataRepository: Repository<UserLoginDataEntity>,
  ) {}

  async createUserLoginDataEntity(userId: string, email: string, password: string): Promise<UserLoginDataEntity> {
    const passwordHash = await this.cryptoService.generateHash(password)

    return this.userLoginDataRepository.create({
      userId,
      email,
      passwordHash,
    })
  }

  findByEmail(email: string): Promise<UserLoginDataEntity | null> {
    return this.userLoginDataRepository.findOne({
      where: { email },
      relations: { userAccount: { role: { permissions: true } } },
    })
  }
}
