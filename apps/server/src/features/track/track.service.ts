import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, In, Repository } from 'typeorm'
import { File } from '@nest-lab/fastify-multer'
import { join } from 'path'
import { createReadStream, existsSync } from 'fs'

import { GenreEntity, TrackArtistEntity, TrackEntity, TrackImageEntity } from './entities'
import { TrackDto, TracksPageOptionsDto, TracksPageDto, CreateTrackDto } from './dto'
import { STREAM_PATH } from '../../app.constants'

import { PageMetaDto } from '@core/dto'
import { ArtistService } from '@features/artist/artist.service'
import { ImageProcessingService, VideoProcessingService } from '@core/services'
import { ArtistRole } from '@features/artist/models'

@Injectable()
export class TrackService {
  private readonly logger = new Logger(TrackService.name)

  constructor(
    @InjectRepository(TrackEntity)
    private readonly repository: Repository<TrackEntity>,
    @InjectRepository(TrackImageEntity)
    private readonly imageRepository: Repository<TrackImageEntity>,
    @InjectRepository(TrackArtistEntity)
    private readonly artistRepository: Repository<TrackArtistEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    private readonly artistService: ArtistService,
    private readonly dataSource: DataSource,
    private readonly imageProcessingService: ImageProcessingService,
    private readonly videoProcessingService: VideoProcessingService,
  ) {}

  async getTrackById(trackId: string): Promise<TrackDto> {
    const song = await this.repository.findOne({
      relations: { images: true, artists: { artist: true }, genres: true },
      where: { id: trackId },
    })

    if (!song) {
      throw new NotFoundException()
    }

    return song.toDto()
  }

  async getTracks(pageOptionsDto: TracksPageOptionsDto): Promise<TracksPageDto> {
    const [tracks, trackCount] = await this.repository.findAndCount({
      relations: { images: true, artists: { artist: true } },
      order: { title: 'asc' },
      skip: pageOptionsDto.offset,
      take: pageOptionsDto.take,
    })

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: trackCount,
    })

    return new TracksPageDto(tracks.toDtos(), pageMetaDto)
  }

  async getArtistTracks(artistId: string, pageOptionsDto: TracksPageOptionsDto): Promise<TracksPageDto> {
    const artistExists = await this.artistService.exists(artistId)

    if (!artistExists) {
      throw new NotFoundException()
    }

    const [tracks, trackCount] = await this.repository.findAndCount({
      where: { artists: { artistId } },
      relations: { images: true, artists: { artist: true } },
      order: { releaseDate: 'desc' },
      skip: pageOptionsDto.offset,
      take: pageOptionsDto.take,
    })

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: trackCount,
    })

    return new TracksPageDto(tracks.toDtos(), pageMetaDto)
  }

  async getPopularTracks(pageOptionsDto: TracksPageOptionsDto): Promise<TracksPageDto> {
    const [tracks, trackCount] = await this.repository.findAndCount({
      relations: { images: true, artists: { artist: true } },
      order: { title: 'asc' },
      skip: pageOptionsDto.offset,
      take: pageOptionsDto.take,
    })

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: trackCount,
    })

    return new TracksPageDto(tracks.toDtos(), pageMetaDto)
  }

  async getNewTracks(pageOptionsDto: TracksPageOptionsDto): Promise<TracksPageDto> {
    const [tracks, trackCount] = await this.repository.findAndCount({
      relations: { images: true, artists: { artist: true } },
      order: { title: 'asc', releaseDate: 'desc' },
      skip: pageOptionsDto.offset,
      take: pageOptionsDto.take,
    })

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: trackCount,
    })

    return new TracksPageDto(tracks.toDtos(), pageMetaDto)
  }

  async createTrack(createTrackDto: CreateTrackDto, image: File, video: File): Promise<TrackDto> {
    const artist = await this.artistService.findOneById(createTrackDto.artistId)

    if (!artist) {
      throw new BadRequestException()
    }

    const genres = await this.genreRepository.findBy({ name: In(createTrackDto.genres) })

    if (genres.length !== createTrackDto.genres.length) {
      throw new BadRequestException()
    }

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const track = this.repository.create({
        title: createTrackDto.title,
        releaseDate: new Date(createTrackDto.releaseDate),
        genres,
        images: [],
        artists: [],
        duration: 0,
      })

      await queryRunner.manager.save(track)

      const trackArtist = this.artistRepository.create({
        trackId: track.id,
        artistId: artist.id,
        role: ArtistRole.REMIXER,
      })

      await queryRunner.manager.save(trackArtist)

      const trackFolderPath = join('tracks', track.id)

      await this.videoProcessingService.generateDashStream({
        video,
        folderPath: trackFolderPath,
      })

      const duration = this.videoProcessingService.getDashStreamDuration({
        folderPath: trackFolderPath,
      })

      await queryRunner.manager.update(TrackEntity, { id: track.id }, { duration })

      const resolutions = await this.imageProcessingService.makeResolutions({
        image,
        folderPath: trackFolderPath,
      })

      for await (const imageResolution of resolutions) {
        const trackImage = this.imageRepository.create({
          resolution: imageResolution.resolution,
          url: imageResolution.url,
          trackId: track.id,
        })

        await queryRunner.manager.save(trackImage)
      }

      await queryRunner.commitTransaction()

      return this.getTrackById(track.id)
    } catch (error) {
      this.logger.error(error)
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException()
    } finally {
      await queryRunner.release()
    }
  }

  stream(trackId: string, filename: string): StreamableFile {
    const filePath = join(STREAM_PATH, 'tracks', trackId, filename)

    if (!existsSync(filePath)) {
      throw new NotFoundException()
    }

    return new StreamableFile(createReadStream(filePath))
  }
}
