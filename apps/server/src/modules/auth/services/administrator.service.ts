import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Roles } from '@neko/permissions'

import { AuthModuleOptions } from '../types'
import { AUTH_MODULE_OPTIONS } from '../tokens'
import { AuthRepository } from '../repositories'
import { RegisterUserUseCase, UpdateRoleUseCase } from '../use-cases'

@Injectable()
export class AdministratorService implements OnApplicationBootstrap {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS) private readonly options: AuthModuleOptions,
    private readonly authRepository: AuthRepository,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.ensureAdministratorExists()
  }

  private async ensureAdministratorExists(): Promise<void> {
    const rootUserAccount = await this.authRepository.findAccountByEmail(this.options.administratorCredentials.email)

    if (!rootUserAccount) {
      const account = await this.registerUserUseCase.invoke({
        email: this.options.administratorCredentials.email,
        password: this.options.administratorCredentials.password,
        displayName: 'Administrator',
      })

      await this.updateRoleUseCase.invoke({
        userId: account.id,
        role: Roles.Administrator,
      })

      return
    }

    if (rootUserAccount.role !== Roles.Administrator) {
      await this.updateRoleUseCase.invoke({
        userId: rootUserAccount.id,
        role: Roles.Administrator,
      })
    }
  }
}
