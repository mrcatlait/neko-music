import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { TrackEntity } from '../entities'
import { TrackDto, TracksPageOptionsDto, TracksPageDto } from '../dto'

import { PageMetaDto } from '@common/dto'
import { ArtistService } from '@modules/artist/services'

@Injectable()
export class TrackService {
  private readonly logger = new Logger(TrackService.name)

  constructor(
    @InjectRepository(TrackEntity)
    private readonly repository: Repository<TrackEntity>,
    private readonly artistService: ArtistService,
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
      relations: { images: true, artists: { artist: true }, genres: true },
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
      relations: { images: true, artists: { artist: true }, genres: true },
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
      relations: { images: true, artists: { artist: true }, genres: true },
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
      relations: { images: true, artists: { artist: true }, genres: true },
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
}
