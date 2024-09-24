import { ApiProperty } from '@nestjs/swagger'
import { IsUrl, Matches } from 'class-validator'

import { ArtistLink } from '@features/artist/models'

export class LinkDto {
  @Matches(`^${[ArtistLink.YOUTUBE, ArtistLink.SOUNDCLOUD].join('|')}$`, 'i')
  @ApiProperty({
    enum: ArtistLink,
  })
  readonly type: ArtistLink

  @IsUrl()
  @ApiProperty()
  readonly url: string
}
