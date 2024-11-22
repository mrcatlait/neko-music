import swagger from '@elysiajs/swagger'
import Elysia from 'elysia'
import cors from '@elysiajs/cors'

import { migrations } from './migrations'
import { seeds } from './seeds'

import { DatabaseService } from '@common/services'
import { loggingPlugin } from '@common/plugins'
import { authenticationController } from '@features/authentication'
import { artistController } from '@features/artist'
import { trackController } from '@features/track'
import { playlistController } from '@features/playlist'
import { CoreContainer } from '@core/core.container'

await new DatabaseService({
  migrationsRun: true,
  migrations,
  seedsRun: true,
  seeds,
}).connect()

const elysiaApp = new Elysia()
  .use(loggingPlugin)
  .use(cors({ origin: CoreContainer.getConfigService().get('UI_URL') }))
  .use(swagger())
  .use(authenticationController)
  .use(artistController)
  .use(trackController)
  .use(playlistController)
  .listen(3000)

console.log(`Server is running at ${elysiaApp.server?.url.toString()}`)
