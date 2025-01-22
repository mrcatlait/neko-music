import { Elysia } from 'elysia'

interface BearerPluginOptions {
  header: string
}

export const bearer = (options: BearerPluginOptions = { header: 'authorization' }) => {
  const BEARER_PREFIX = 'Bearer '
  const BEARER_LENGTH = BEARER_PREFIX.length

  const header = options.header.toLowerCase()

  return new Elysia({ name: 'bearer/plugin', seed: options }).derive({ as: 'global' }, ({ headers }) => {
    const auth = headers[header]

    if (!auth) {
      return {
        token: null,
      }
    }

    return {
      token: auth.startsWith(BEARER_PREFIX, 0) ? auth.slice(BEARER_LENGTH) : null,
    }
  })
}
