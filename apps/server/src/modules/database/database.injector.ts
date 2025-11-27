import { Inject } from '@nestjs/common'

import { DATABASE } from './database.tokens'

export const InjectDatabase = () => Inject(DATABASE)
