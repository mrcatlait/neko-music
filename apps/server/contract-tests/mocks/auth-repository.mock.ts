import type { PartiallyMocked } from 'vitest'

import { AuthRepository } from '@/modules/auth/repositories'

export const authRepositoryMock: PartiallyMocked<AuthRepository> = {
  findAccountWithCredentialsByEmail: vi.fn(),
  createRefreshToken: vi.fn(),
}
