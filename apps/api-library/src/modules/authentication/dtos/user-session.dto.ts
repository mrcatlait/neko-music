import { ApiProperty } from '@nestjs/swagger'

export class UserSessionDto {
  @ApiProperty({
    description: 'The id of the user',
  })
  id: string

  @ApiProperty({
    description: 'The display name of the user',
  })
  displayName: string

  @ApiProperty({
    description: 'List of user permissions',
    type: [String],
  })
  permissions: string[]
}
