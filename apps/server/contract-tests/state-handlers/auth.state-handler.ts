import { MessageStateHandlers } from '@pact-foundation/pact'
import { hashSync } from 'bcrypt'

import { authRepositoryMock, userRepositoryMock } from '../mocks'

const PASSWORD = 'password123'
const PASSWORD_HASH = hashSync(PASSWORD, 10)

export const authStateHandler: MessageStateHandlers = {
  'a user exists': async () => {
    authRepositoryMock.findAccountWithCredentialsByEmail?.mockResolvedValue({
      id: 'test-user-id',
      emailAddress: 'test@example.com',
      role: 'user',
      passwordHash: PASSWORD_HASH,
      passwordSalt: '',
    })
    userRepositoryMock.findProfileByUserId?.mockResolvedValue({
      userId: 'test-user-id',
      displayName: 'John Doe',
    })
    authRepositoryMock.createRefreshToken?.mockResolvedValue({
      id: '1',
      userId: 'test-user-id',
      token: 'refresh-token',
      expiresAt: new Date(),
    })

    return Promise.resolve()
  },
}
