import type { PartiallyMocked } from 'vitest'

import { UserRepository } from '@/modules/user/repositories'

export const userRepositoryMock: PartiallyMocked<UserRepository> = {
  findProfileByUserId: vi.fn(),
}
