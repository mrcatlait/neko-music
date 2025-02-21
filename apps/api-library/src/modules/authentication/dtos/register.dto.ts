import { IsString, IsEmail, MinLength, MaxLength, IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  password: string

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  displayName: string
}
