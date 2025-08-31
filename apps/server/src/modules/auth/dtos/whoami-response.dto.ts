import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class WhoamiResponse implements Contracts.Auth.WhoamiResponse {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string

  @ApiProperty({
    description: 'The display name of the user',
    example: 'John Doe',
  })
  displayName: string

  @ApiProperty({
    description: 'The permissions of the user',
    example: ['user.read', 'user.write'],
  })
  permissions: string[]
}
