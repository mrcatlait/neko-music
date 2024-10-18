import { ResponseOptions } from '@pact-foundation/pact'

export type PactResponseOptions = Omit<ResponseOptions, 'body'> & { body: unknown }

export type PactResponses = Record<string, { willRespondWith: PactResponseOptions }>
