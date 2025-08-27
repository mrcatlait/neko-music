import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokenResponse implements Contracts.Auth.RefreshTokenResponse {
  @ApiProperty({
    description: 'The access token of the user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
  })
  accessToken: string
}
