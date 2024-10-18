import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserRoleEntity } from '../entities'

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  getRoleById(roleId: string): Promise<UserRoleEntity> {
    return this.userRoleRepository.findOneOrFail({ where: { id: roleId }, relations: { permissions: true } })
  }
}
