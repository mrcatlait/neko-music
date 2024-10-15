import { ApiProperty } from '@nestjs/swagger'

export class TokenPayloadDto {
  @ApiProperty()
  readonly accessToken: string

  constructor(data: { accessToken: string }) {
    this.accessToken = data.accessToken
  }
}
