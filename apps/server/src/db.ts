import postgres from 'postgres'

import { CoreContainer } from '@core/core.container'

export const sql = postgres({
  host: CoreContainer.getConfigService().get('POSTGRES_HOST'),
  port: CoreContainer.getConfigService().get('POSTGRES_PORT'),
  username: CoreContainer.getConfigService().get('POSTGRES_USER'),
  password: CoreContainer.getConfigService().get('POSTGRES_PASSWORD'),
  database: CoreContainer.getConfigService().get('POSTGRES_DB'),
})
