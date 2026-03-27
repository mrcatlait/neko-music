import { inject, Injectable, signal } from '@angular/core'
import {
  AnyVariables,
  cacheExchange,
  Client,
  fetchExchange,
  OperationResult,
  OperationResultSource,
  TypedDocumentNode,
} from '@urql/core'
import { authExchange } from '@urql/exchange-auth'
import { firstValueFrom } from 'rxjs'
import { persistedExchange } from '@urql/exchange-persisted'

import { AuthStore, RefreshTokenAuthStrategy } from '../auth'
import { ENVIRONMENT } from '../providers'

class GraphqlResource<Result> {
  readonly error = signal<Error | null>(null)
  readonly value = signal<Result | null>(null)

  constructor(readonly request: () => OperationResultSource<OperationResult<Result, AnyVariables>>) {
    this.request()
      .toPromise()
      .then((result) => {
        if (result.error) {
          this.error.set(result.error)
        }

        if (result.data) {
          this.value.set(result.data)
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          this.error.set(error)
        } else {
          this.error.set(new Error(String(error)))
        }
      })
  }
}

@Injectable({
  providedIn: 'root',
})
export class Graphql {
  private readonly environment = inject(ENVIRONMENT)
  private readonly accessToken = inject(AuthStore).accessToken
  private readonly refreshTokenAuth = inject(RefreshTokenAuthStrategy)

  private readonly client = new Client({
    url: this.environment.graphqlUrl,
    preferGetMethod: false,
    exchanges: [
      cacheExchange,
      // persistedExchange({
      //   preferGetForPersistedQueries: false,
      //   enforcePersistedQueries: true,
      //   enableForSubscriptions: true,
      //   generateHash: (_, document: any) => Promise.resolve(document['__meta__']['hash']),
      // }),
      authExchange(async (utils) => ({
        addAuthToOperation: (operation) => {
          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${this.accessToken()}`,
          })
        },
        didAuthError: (error) => {
          return error.graphQLErrors.some((e) => e.message === 'Unauthorized')
        },
        refreshAuth: async () => {
          await firstValueFrom(this.refreshTokenAuth.refreshAccessToken())
        },
      })),
      fetchExchange,
    ],
  })

  query<Result, Variables extends AnyVariables = AnyVariables>(
    query: TypedDocumentNode<Result, Variables>,
    variables: Variables,
  ): Promise<OperationResult<Result, Variables>> {
    return this.client.query<Result, Variables>(query, variables).toPromise()
  }

  mutation<Result, Variables extends AnyVariables = AnyVariables>(
    mutation: TypedDocumentNode<Result, Variables>,
    variables: Variables,
  ): Promise<OperationResult<Result, Variables>> {
    return this.client.mutation<Result, Variables>(mutation, variables).toPromise()
  }

  /**
   * GraphQL implementation of the HttpResource class.
   * @param resource - The GraphQL query to execute.
   * @param variables - The variables to pass to the GraphQL query.
   * @returns A new GraphqlResource instance that will fetch the data from the GraphQL server and store it in the signal.
   */
  graphqlResource = <Result, Variables extends AnyVariables = AnyVariables>(
    resource: TypedDocumentNode<Result, Variables>,
    variables: Variables,
  ) => {
    return new GraphqlResource<Result>(() => this.client.query<Result, Variables>(resource, variables))
  }
}
