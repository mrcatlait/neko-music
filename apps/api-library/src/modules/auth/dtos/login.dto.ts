import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength } from 'class-validator'

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string

  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string
}
