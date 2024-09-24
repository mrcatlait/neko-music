import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly title: string

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  readonly artistId: string

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  readonly releaseDate: string

  @IsArray()
  @ApiProperty()
  readonly genres: string[]

  @ApiProperty({ type: 'string', format: 'binary' })
  image: string

  @ApiProperty({ type: 'string', format: 'binary' })
  video: string
}
