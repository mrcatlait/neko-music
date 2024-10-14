import { ObjectLiteral, Repository } from 'typeorm'
import { PartiallyMocked } from 'vitest'

export function repositoryMockFactory<Entity extends ObjectLiteral>(): PartiallyMocked<Repository<Entity>> {
  return {
    findOne: vi.fn(),
    findOneById: vi.fn(),
    findBy: vi.fn(),
    create: vi.fn(),
    findAndCount: vi.fn(),
    existsBy: vi.fn(),
  }
}
