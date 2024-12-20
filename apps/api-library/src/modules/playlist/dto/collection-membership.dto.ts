import { ApiProperty } from '@nestjs/swagger'

class CollectionMembershipDataDto {
  @ApiProperty({
    minimum: 0,
  })
  total: number

  @ApiProperty({
    minimum: 0,
  })
  existing: number
}

export class CollectionMembershipDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty({
    type: CollectionMembershipDataDto,
  })
  membership: CollectionMembershipDataDto
}
