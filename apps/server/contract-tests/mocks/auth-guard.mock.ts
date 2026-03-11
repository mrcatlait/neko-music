import type { PartiallyMocked } from 'vitest'

import { AuthGuard } from '@/modules/auth/guards'

export const authGuardMock: PartiallyMocked<AuthGuard> = {
  canActivate: vi.fn().mockResolvedValue(true),
}
