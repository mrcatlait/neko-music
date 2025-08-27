import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class LoginResponse implements Contracts.Auth.LoginResponse {
  @ApiProperty({
    description: 'The access token of the user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
  })
  accessToken: string

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
