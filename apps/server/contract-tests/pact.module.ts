import '../src/polyfill'
import { DynamicModule, INestApplication, Inject, Injectable, Module, ValueProvider } from '@nestjs/common'
import { Verifier, VerifierOptions } from '@pact-foundation/pact'
import { resolve } from 'path'

export const PACT_OPTIONS = 'PACT_OPTIONS'

@Injectable()
export class PactVerifierService {
  constructor(@Inject(PACT_OPTIONS) private readonly options: VerifierOptions) {}

  async verify(app: INestApplication): Promise<string> {
    const host = new URL('http://localhost')

    await app.listen(host.port, host.hostname)

    // this can throw an error, we are sure the app will close after calling finally
    return (
      new Verifier({ ...this.options, providerBaseUrl: await app.getUrl() })
        .verifyProvider()
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .finally(() => app.close())
    )
  }
}

@Module({})
export class PactModule {
  static register(options?: VerifierOptions): DynamicModule {
    const optionsProvider: ValueProvider<VerifierOptions> = {
      provide: PACT_OPTIONS,
      useValue: {
        ...options,
        provider: 'music-library-api',
        pactUrls: [resolve(process.cwd(), '..', '..', 'contracts')],
      },
    }

    return {
      module: PactModule,
      exports: [PactVerifierService],
      providers: [optionsProvider, PactVerifierService],
    }
  }
}
