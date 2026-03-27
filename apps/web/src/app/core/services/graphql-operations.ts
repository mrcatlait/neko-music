import { inject, Injectable } from '@angular/core'
import type { AnyVariables, OperationResult, TypedDocumentNode } from '@urql/core'

import { Graphql } from './graphql'

@Injectable()
export abstract class GraphqlQuery<TData = unknown, TVariables extends AnyVariables = AnyVariables> {
  abstract readonly document: TypedDocumentNode<TData, TVariables>

  protected readonly graphql = inject(Graphql)

  fetch(variables: TVariables): Promise<OperationResult<TData, TVariables>> {
    return this.graphql.query(this.document, variables)
  }

  graphqlResource(variables: TVariables) {
    return this.graphql.graphqlResource(this.document, variables)
  }
}

@Injectable()
export abstract class GraphqlMutation<TData = unknown, TVariables extends AnyVariables = AnyVariables> {
  abstract readonly document: TypedDocumentNode<TData, TVariables>

  protected readonly graphql = inject(Graphql)

  mutate(variables: TVariables): Promise<OperationResult<TData, TVariables>> {
    return this.graphql.mutation(this.document, variables)
  }
}
