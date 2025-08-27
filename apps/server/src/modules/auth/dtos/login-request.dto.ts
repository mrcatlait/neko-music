import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MaxLength, IsNotEmpty } from 'class-validator'
import { Contracts } from '@neko/contracts'

export class LoginRequest implements Contracts.Auth.LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string
}
