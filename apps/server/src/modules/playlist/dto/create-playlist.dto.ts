import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description?: string

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly isPublic: boolean
}
