import { Elysia } from 'elysia'

import { authenticationPlugin } from '@features/authentication/plugins'

export const loggingPlugin = new Elysia({ name: 'logging/plugin' })
  .use(authenticationPlugin)
  .state({
    startTime: 0 as number,
  })
  .onRequest((ctx) => {
    ctx.store = { ...ctx.store, startTime: performance.now() }
  })
  .onAfterResponse({ as: 'global' }, (ctx) => {
    const endTime = performance.now()
    const responseTime = Math.round(endTime - ctx.store.startTime)
    const method = ctx.request.method
    const url = ctx.request.url
    const status = ctx.set.status

    console.log(`${method} ${url} ${status} - ${responseTime}ms `)
  })
