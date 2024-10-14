import { ResponseOptions } from '@pact-foundation/pact'

export type PactResponseOptions = Omit<ResponseOptions, 'body'> & { body: any }

export type PactResponses = Record<string, { willRespondWith: PactResponseOptions }>
