import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { File } from '@nest-lab/fastify-multer'
import { join } from 'path'

import { ArtistEntity, ArtistImageEntity, ArtistLinkEntity } from './entities'
import { ArtistDto, ArtistsPageDto, ArtistsPageOptionsDto, CreateArtistDto } from './dto'

import { PageMetaDto } from '@core/dto'
import { ImageProcessingService } from '@core/services'

@Injectable()
export class ArtistService {
  private readonly logger = new Logger(ArtistService.name)

  constructor(
    @InjectRepository(ArtistEntity)
    private readonly repository: Repository<ArtistEntity>,
    @InjectRepository(ArtistImageEntity)
    private readonly imageRepository: Repository<ArtistImageEntity>,
    @InjectRepository(ArtistLinkEntity)
    private readonly linkRepository: Repository<ArtistLinkEntity>,
    private readonly dataSource: DataSource,
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  async getArtist(artistId: string): Promise<ArtistDto> {
    const artist = await this.repository.findOne({
      relations: { images: true, links: true },
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
      relations: { images: true, links: true },
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

  async getPopularArtists(pageOptionsDto: ArtistsPageOptionsDto): Promise<ArtistsPageDto> {
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

  async createArtist(createArtistDto: CreateArtistDto, image: File): Promise<ArtistDto> {
    const artistExists = await this.repository.findOneBy({ name: createArtistDto.name })

    if (artistExists) {
      throw new BadRequestException()
    }

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const artist = this.repository.create({
        name: createArtistDto.name,
        links: [],
        images: [],
      })

      await queryRunner.manager.save(artist)

      for await (const link of createArtistDto.links) {
        const artistLink = this.linkRepository.create({
          url: link.url,
          artistId: artist.id,
          type: link.type,
        })

        await queryRunner.manager.save(artistLink)
      }

      const artistFolderPath = join('artists', artist.id)

      const resolutions = await this.imageProcessingService.makeResolutions({
        image,
        folderPath: artistFolderPath,
      })

      for await (const imageResolution of resolutions) {
        const artistImage = this.imageRepository.create({
          resolution: imageResolution.resolution,
          url: imageResolution.url,
          artistId: artist.id,
        })

        await queryRunner.manager.save(artistImage)
      }

      await queryRunner.commitTransaction()

      return this.getArtist(artist.id)
    } catch (error) {
      this.logger.error(error)
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException()
    } finally {
      await queryRunner.release()
    }
  }
}
