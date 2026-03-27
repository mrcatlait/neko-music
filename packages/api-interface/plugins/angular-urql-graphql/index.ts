import { extname } from 'path'

import { concatAST, Kind } from 'graphql'
import { oldVisit } from '@graphql-codegen/plugin-helpers'
import type { LoadedFragment } from '@graphql-codegen/visitor-plugin-common'
import type { PluginFunction, PluginValidateFn, Types } from '@graphql-codegen/plugin-helpers'

import type { AngularUrqlGraphqlRawPluginConfig } from './config'
import { AngularUrqlGraphqlVisitor } from './visitor'

export const plugin: PluginFunction<AngularUrqlGraphqlRawPluginConfig> = (
  schema,
  documents: Types.DocumentFile[],
  config: AngularUrqlGraphqlRawPluginConfig,
) => {
  const allAst = concatAST(documents.map((d) => d.document!))
  const allFragments: LoadedFragment[] = [
    ...(allAst.definitions.filter((d) => d.kind === Kind.FRAGMENT_DEFINITION)).map(
      (fragmentDef) => ({
        node: fragmentDef,
        name: fragmentDef.name.value,
        onType: fragmentDef.typeCondition.name.value,
        isExternal: false,
      }),
    ),
    ...(config.externalFragments || []),
  ]

  const visitor = new AngularUrqlGraphqlVisitor(schema, allFragments, config, documents)
  const visitorResult = oldVisit(allAst, { leave: visitor as never })

  return {
    prepend: visitor.getImports(),
    content: [
      visitor.fragments,
      ...visitorResult.definitions.filter((t: unknown): t is string => typeof t === 'string'),
    ].join('\n'),
  }
}

export const validate: PluginValidateFn = async (_schema, _documents, _config, outputFile) => {
  const ext = extname(outputFile)
  if (ext !== '.ts' && ext !== '.tsx') {
    throw new Error('Plugin "angular-urql-graphql" requires the output file extension to be ".ts" or ".tsx".')
  }
}

export { AngularUrqlGraphqlVisitor } from './visitor'
export type { AngularUrqlGraphqlPluginConfig, AngularUrqlGraphqlRawPluginConfig } from './config'
export { angularUrqlGraphqlPluginId } from './config'
