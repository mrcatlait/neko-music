import type { ExecutionContext } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'
import type { PartiallyMocked } from 'vitest'
import { Roles } from '@neko/permissions'

import { AuthGuard } from '@/modules/auth/guards'

export const authGuardMock: PartiallyMocked<AuthGuard> = {
  canActivate: vi.fn().mockImplementation((context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<FastifyRequest>()
    req.user = { id: 'test-user-id', role: Roles.Administrator }
    return true
  }),
}
