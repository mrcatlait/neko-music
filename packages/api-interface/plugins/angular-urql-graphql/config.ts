import type { ClientSideBasePluginConfig, RawClientSideBasePluginConfig } from '@graphql-codegen/visitor-plugin-common'

/** Runtime marker so this module emits JS when compiled (types-only files would be empty). */
export const angularUrqlGraphqlPluginId = 'angular-urql-graphql' as const

export interface AngularUrqlGraphqlRawPluginConfig extends RawClientSideBasePluginConfig {
  /** Import path for `GraphqlQuery` and `GraphqlMutation` (default: `@/core/services/graphql-operations`). */
  operationsImportPath?: string
  querySuffix?: string
  mutationSuffix?: string
  subscriptionSuffix?: string
  skipSubscriptions?: boolean
  providedIn?: string
  addExplicitOverride?: boolean
}

export interface AngularUrqlGraphqlPluginConfig extends ClientSideBasePluginConfig {
  operationsImportPath: string
  querySuffix: string
  mutationSuffix: string
  subscriptionSuffix: string
  skipSubscriptions: boolean
  addExplicitOverride: boolean
}
