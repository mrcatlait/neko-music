import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength, MaxLength, IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
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
