import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'
import { Role } from '@neko/permissions'

import { AccountTable, AuthSchema, CredentialsTable, RefreshTokenTable } from '../auth.schema'

import { Database, InjectDatabase } from '@/modules/database'

interface CreateAccountWithCredentialsParams {
  readonly email: string
  readonly role: string
  readonly passwordHash: string
  readonly passwordSalt: string
}

type AccountWithCredentials = Selectable<AccountTable & Omit<CredentialsTable, 'userId'>>

@Injectable()
export class AuthRepository {
  constructor(@InjectDatabase() private readonly database: Database<AuthSchema>) {}

  /**
   * Create account with credentials in a single transaction
   */
  createAccountWithCredentials(params: CreateAccountWithCredentialsParams): Promise<Selectable<AccountTable>> {
    return this.database.transaction().execute(async (trx) => {
      const account = await trx
        .insertInto('auth.Account')
        .values({
          emailAddress: params.email,
          role: params.role,
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
        'auth.Account.role',
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
   * Find account by email
   */
  findAccountByEmail(email: string): Promise<Selectable<AccountTable> | undefined> {
    return this.database.selectFrom('auth.Account').where('emailAddress', '=', email).selectAll().executeTakeFirst()
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
   * Update role by user ID
   */
  updateRoleByUserId(userId: string, role: Role): Promise<void> {
    return this.database
      .updateTable('auth.Account')
      .set({ role })
      .where('id', '=', userId)
      .execute()
      .then(() => undefined)
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
