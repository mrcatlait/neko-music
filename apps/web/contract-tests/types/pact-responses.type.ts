import { ResponseOptions } from '@pact-foundation/pact'

type PactResponseOptions = Omit<ResponseOptions, 'body'> & { body: any }

export type PactResponses = Record<string, { willRespondWith: PactResponseOptions }>
