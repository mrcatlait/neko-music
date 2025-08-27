import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength, MaxLength, IsNotEmpty, Matches } from 'class-validator'
import { Contracts } from '@neko/contracts'

export class RegistrationRequest implements Contracts.Auth.RegistrationRequest {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/[^a-zA-Z]/)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty({
    description: 'The display name of the user',
    example: 'John Doe',
  })
  displayName: string
}
