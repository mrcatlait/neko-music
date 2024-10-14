import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ArtistEntity } from './entities'
import { ArtistDto, ArtistsPageDto, ArtistsPageOptionsDto } from './dto'

import { PageMetaDto } from '@core/dto'

@Injectable()
export class ArtistService {
  private readonly logger = new Logger(ArtistService.name)

  constructor(
    @InjectRepository(ArtistEntity)
    private readonly repository: Repository<ArtistEntity>,
  ) {}

  async getArtist(artistId: string): Promise<ArtistDto> {
    const artist = await this.repository.findOne({
      relations: { images: true },
      where: { id: artistId },
    })

    if (!artist) {
      throw new NotFoundException()
    }

    return artist.toDto()
  }

  findOneById(artistId: string): Promise<ArtistEntity | null> {
    return this.repository.findOneBy({ id: artistId })
  }

  exists(artistId: string): Promise<boolean> {
    return this.repository.existsBy({ id: artistId })
  }

  async getArtists(pageOptionsDto: ArtistsPageOptionsDto): Promise<ArtistsPageDto> {
    const [artists, artistCount] = await this.repository.findAndCount({
      relations: { images: true },
      order: { name: 'asc' },
      skip: pageOptionsDto.offset,
      take: pageOptionsDto.take,
    })

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: artistCount,
    })

    return new ArtistsPageDto(artists.toDtos(), pageMetaDto)
  }
}
