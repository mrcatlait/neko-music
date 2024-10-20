import { CreatePermissions1000000000010 } from './1000000000010-CreatePermissions'
import { CreateRoles1000000000020 } from './1000000000020-CreateRoles'
import { GrantPermissions1000000000030 } from './1000000000030-GrantPermissions'

import { SeedClass } from '@modules/database-seed/types'

export const seeds: SeedClass[] = [
  CreatePermissions1000000000010,
  CreateRoles1000000000020,
  GrantPermissions1000000000030,
]
