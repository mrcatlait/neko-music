import type { CodegenConfig } from '@graphql-codegen/cli'
import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset'

const config: CodegenConfig = {
  overwrite: true,
  schema: '../../apps/server/schema.gql',
  documents: '../../apps/web/**/!(*.d).{ts,gql}',
  generates: {
    // https://the-guild.dev/graphql/codegen/docs/getting-started/development-workflow
    '../../apps/web/src/app/shared/graphql/': {
      preset: 'client',
      documentTransforms: [addTypenameSelectionDocumentTransform],
    },
  },
}

export default config
