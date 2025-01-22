import Elysia from 'elysia'
import swagger from '@elysiajs/swagger'

import { trackController, artistController } from '@features/music-metadata/controllers'
import { playlistController } from '@features/playlist/controllers'
import { DatabaseService } from '@common/database'
import { Container } from '@common/di'
import { streamingController } from '@features/streaming/controllers'
import { authController } from '@features/authentication/infrastructure/controllers'

const bootstrap = async () => {
  await Container.get(DatabaseService).onApplicationBootstrap()

  new Elysia()
    .use(
      swagger({
        // documentation: {
        //   components: {
        //     securitySchemes: {
        //       Bearer: {
        //         type: 'http',
        //         scheme: 'bearer',
        //         bearerFormat: 'JWT',
        //       },
        //     },
        //   },
        // },
      }),
    )
    .use(artistController())
    .use(playlistController())
    .use(streamingController())
    .use(trackController())
    .use(authController())
    .onStart(({ server }) => {
      console.log(`Server is running at ${server?.url.toString()}`)
    })
    .listen(Number(process.env.PORT))
}

bootstrap().catch(console.error)

// https://github.com/lukas-andre/bun-elysia-clean-architecture-example/blob/main/src/shared/infrastructure/auth/jwt.ts
