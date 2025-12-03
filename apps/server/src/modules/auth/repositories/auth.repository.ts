import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import {
  Database,
  InjectDatabase,
  AccountTable,
  RoleTable,
  PermissionTable,
  CredentialsTable,
  RefreshTokenTable,
} from '@/modules/database'

interface CreateAccountWithCredentialsParams {
  readonly email: string
  readonly passwordHash: string
  readonly passwordSalt: string
  readonly roleId: string
}

type AccountWithCredentials = Selectable<AccountTable & Omit<CredentialsTable, 'userId'>>

@Injectable()
export class AuthRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  /**
   * Create account with credentials in a single transaction
   */
  createAccountWithCredentials(params: CreateAccountWithCredentialsParams): Promise<Selectable<AccountTable>> {
    return this.database.transaction().execute(async (trx) => {
      const account = await trx
        .insertInto('auth.Account')
        .values({
          emailAddress: params.email,
          roleId: params.roleId,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto('auth.Credentials')
        .values({
          userId: account.id,
          passwordHash: params.passwordHash,
          passwordSalt: params.passwordSalt,
        })
        .execute()

      return account
    })
  }

  /**
   * Check if an account exists by email
   */
  accountExistsByEmail(email: string): Promise<boolean> {
    return this.database
      .selectFrom('auth.Account')
      .where('emailAddress', '=', email)
      .selectAll()
      .executeTakeFirst()
      .then((result) => Boolean(result))
  }

  /**
   * Get account's permissions (via their role)
   */
  findAccountPermissions(accountId: string): Promise<Selectable<PermissionTable>[]> {
    return this.database
      .selectFrom('auth.Permission')
      .innerJoin('auth.RolePermission', 'auth.RolePermission.permissionId', 'auth.Permission.id')
      .innerJoin('auth.Account', 'auth.Account.roleId', 'auth.RolePermission.roleId')
      .where('auth.Account.id', '=', accountId)
      .select(['auth.Permission.id', 'auth.Permission.name', 'auth.Permission.description'])
      .execute()
  }

  /**
   * Find account with credentials by email
   */
  findAccountWithCredentialsByEmail(email: string): Promise<AccountWithCredentials | undefined> {
    return this.database
      .selectFrom('auth.Account')
      .innerJoin('auth.Credentials', 'auth.Credentials.userId', 'auth.Account.id')
      .where('auth.Account.emailAddress', '=', email)
      .select([
        'auth.Account.id',
        'auth.Account.emailAddress',
        'auth.Account.roleId',
        'auth.Credentials.passwordHash',
        'auth.Credentials.passwordSalt',
      ])
      .executeTakeFirst()
  }

  /**
   * Find account by ID
   */
  findAccountById(id: string): Promise<Selectable<AccountTable> | undefined> {
    return this.database.selectFrom('auth.Account').where('id', '=', id).selectAll().executeTakeFirst()
  }

  /**
   * Find default role for new accounts
   */
  findDefaultRole(): Promise<Selectable<RoleTable> | undefined> {
    return this.database.selectFrom('auth.Role').where('default', '=', true).selectAll().executeTakeFirst()
  }

  /**
   * Create refresh token
   */
  createRefreshToken(refreshToken: Insertable<RefreshTokenTable>): Promise<Selectable<RefreshTokenTable>> {
    return this.database.insertInto('auth.RefreshToken').values(refreshToken).returningAll().executeTakeFirstOrThrow()
  }

  /**
   * Find refresh token by token
   */
  findRefreshTokenByToken(token: string): Promise<Selectable<RefreshTokenTable> | undefined> {
    return this.database.selectFrom('auth.RefreshToken').where('token', '=', token).selectAll().executeTakeFirst()
  }

  /**
   * Delete refresh token by user ID
   */
  deleteRefreshTokenByUserId(userId: string): Promise<void> {
    return this.database
      .deleteFrom('auth.RefreshToken')
      .where('userId', '=', userId)
      .execute()
      .then(() => undefined)
  }

  /**
   * Delete refresh token by token
   */
  deleteRefreshTokenByToken(token: string): Promise<void> {
    return this.database
      .deleteFrom('auth.RefreshToken')
      .where('token', '=', token)
      .execute()
      .then(() => undefined)
  }

  /**
   * Delete expired refresh tokens
   */
  deleteExpiredRefreshTokens(): Promise<void> {
    return this.database
      .deleteFrom('auth.RefreshToken')
      .where('expiresAt', '<', new Date())
      .execute()
      .then(() => undefined)
  }
}
