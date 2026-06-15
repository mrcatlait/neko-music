import { Field, ObjectType } from '@nestjs/graphql'

import { ImportDiscovery } from './import-discovery.model'

@ObjectType()
export class ImportDiscoveryRefreshResult {
  @Field(() => ImportDiscovery)
  discovery: ImportDiscovery

  @Field(() => [String])
  newSourceItemRefs: string[]

  @Field(() => [String])
  removedSourceItemRefs: string[]
}
