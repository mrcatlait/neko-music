import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ImportDiscoveryTrack } from './import-discovery-track.model'

@ObjectType()
export class ImportDiscovery {
  @Field(() => ID)
  id: string

  @Field(() => String)
  dataSource: string

  @Field(() => String)
  sourceRef: string

  @Field(() => String)
  label: string

  @Field(() => [ImportDiscoveryTrack])
  tracks: ImportDiscoveryTrack[]
}
