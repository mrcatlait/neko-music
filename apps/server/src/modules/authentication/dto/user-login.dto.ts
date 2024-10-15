import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@admin.com' })
  readonly email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1234',
  })
  readonly password: string
}
