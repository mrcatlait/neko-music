import type { ExecutionContext } from '@nestjs/common'
import type { PartiallyMocked } from 'vitest'

import { AuthGuard } from '@/modules/auth/guards'

export const authGuardMock: PartiallyMocked<AuthGuard> = {
  canActivate: vi.fn().mockImplementation(async (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest()
    req.user = { id: 'test-user-id', role: 'admin' }
    return true
  }),
}
