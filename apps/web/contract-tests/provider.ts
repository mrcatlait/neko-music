import { Pact, SpecificationVersion } from '@pact-foundation/pact'
import { resolve } from 'path'

export const provider = new Pact({
  logLevel: 'info',
  consumer: 'web',
  provider: 'neko-music-api',
  dir: resolve(process.cwd(), '..', '..', 'contracts'),
  spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
})
