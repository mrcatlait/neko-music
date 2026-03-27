import autoBind from 'auto-bind'
import type { FragmentDefinitionNode, GraphQLSchema, OperationDefinitionNode } from 'graphql'
import { Kind } from 'graphql'
import type { Types } from '@graphql-codegen/plugin-helpers'
import {
  ClientSideBaseVisitor,
  DocumentMode,
  getConfigValue,
  type LoadedFragment,
} from '@graphql-codegen/visitor-plugin-common'

import type { AngularUrqlGraphqlPluginConfig, AngularUrqlGraphqlRawPluginConfig } from './config'

export class AngularUrqlGraphqlVisitor extends ClientSideBaseVisitor<
  AngularUrqlGraphqlRawPluginConfig,
  AngularUrqlGraphqlPluginConfig
> {
  private _externalImportPrefix = ''

  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    rawConfig: AngularUrqlGraphqlRawPluginConfig,
    documents: Types.DocumentFile[] = [],
  ) {
    super(schema, fragments, rawConfig, {
      gqlImport: getConfigValue(rawConfig.gqlImport, '@urql/core#gql'),
      documentMode: getConfigValue(rawConfig.documentMode, DocumentMode.graphQLTag),
      operationsImportPath: getConfigValue(rawConfig.operationsImportPath, '@/core/services/graphql-operations'),
      querySuffix: getConfigValue(rawConfig.querySuffix, 'Gql'),
      mutationSuffix: getConfigValue(rawConfig.mutationSuffix, 'Gql'),
      subscriptionSuffix: getConfigValue(rawConfig.subscriptionSuffix, 'Gql'),
      skipSubscriptions: getConfigValue(rawConfig.skipSubscriptions, true),
      addExplicitOverride: getConfigValue(rawConfig.addExplicitOverride, true),
    }, documents)

    if (this.config.importOperationTypesFrom) {
      this._externalImportPrefix = `${this.config.importOperationTypesFrom}.`
    }

    autoBind(this)
  }

  public getImports(): string[] {
    const baseImports = super.getImports()
    if (this._collectedOperations.length === 0) {
      return baseImports
    }

    return [
      ...baseImports,
      `import { Injectable } from '@angular/core';`,
      `import type { TypedDocumentNode } from '@urql/core';`,
      `import { GraphqlQuery, GraphqlMutation } from '${this.config.operationsImportPath}';`,
    ]
  }

  protected getDocumentNodeSignature(
    resultType: string,
    variablesTypes: string,
    node: FragmentDefinitionNode | OperationDefinitionNode,
  ): string {
    if (node.kind !== Kind.OPERATION_DEFINITION) {
      return ''
    }
    return ` as unknown as TypedDocumentNode<${resultType}, ${variablesTypes}>`
  }

  private _operationSuffix(operationType: string): string {
    switch (operationType) {
      case 'Query':
        return this.config.querySuffix ?? 'Gql'
      case 'Mutation':
        return this.config.mutationSuffix ?? 'Gql'
      case 'Subscription':
        return this.config.subscriptionSuffix ?? 'Gql'
      default:
        return 'Gql'
    }
  }

  private _documentVariableReference(
    node: OperationDefinitionNode,
    documentVariableName: string,
  ): string {
    if (this.config.importDocumentNodeExternallyFrom === 'near-operation-file' && this._documents.length === 1) {
      return `Operations.${documentVariableName}`
    }
    if (this.config.importOperationTypesFrom) {
      return `${this.config.importOperationTypesFrom}.${documentVariableName}`
    }
    return documentVariableName
  }

  protected buildOperation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string,
    _hasRequiredVariables: boolean,
  ): string {
    if (operationType === 'Subscription') {
      if (!this.config.skipSubscriptions) {
        throw new Error(
          'angular-urql-graphql: subscription services are not implemented. Set skipSubscriptions: true or remove subscription operations.',
        )
      }
      return ''
    }

    const serviceName = `${this.convertName(node)}${this._operationSuffix(operationType)}`
    const resultType = this._externalImportPrefix + operationResultType
    const variablesType = this._externalImportPrefix + operationVariablesTypes

    const documentRef = this._documentVariableReference(node, documentVariableName)
    const base = operationType === 'Mutation' ? 'GraphqlMutation' : 'GraphqlQuery'

    const overrideKw = this.config.addExplicitOverride ? 'override ' : ''

    return `
@Injectable()
export class ${serviceName} extends ${base}<${resultType}, ${variablesType}> {
  ${overrideKw}readonly document = ${documentRef};
}`
  }
}
