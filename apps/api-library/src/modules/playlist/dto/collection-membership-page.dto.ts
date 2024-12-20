import { ApiProperty } from '@nestjs/swagger'

import { CollectionMembershipDto } from './collection-membership.dto'

import { PageMetaDto } from '@modules/shared/dtos'

export class CollectionMembershipPageDto {
  @ApiProperty({
    type: () => CollectionMembershipDto,
    isArray: true,
  })
  readonly data: CollectionMembershipDto[]

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto

  constructor(data: CollectionMembershipDto[], meta: PageMetaDto) {
    this.data = data
    this.meta = meta
  }
}
