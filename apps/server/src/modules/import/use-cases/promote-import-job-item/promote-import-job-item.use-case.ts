import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { ClaimReviewDecision, MetadataClaimField } from '../../enums'
import { ImportJobItemRepository, MetadataClaimRepository, MetadataClaimReviewRepository } from '../../repositories'
import { GetImportJobItemPromotionEligibilityUseCase } from '../get-import-job-item-promotion-eligibility'

import { CreateBackstageArtistUseCase } from '@/modules/backstage/artist/use-cases'
import { CreateBackstageAlbumUseCase } from '@/modules/backstage/album/use-cases'
import { CreateBackstageTrackUseCase } from '@/modules/backstage/track/use-cases'
import { AlbumType, TrackType } from '@/modules/shared/enums'
import { UseCase } from '@/modules/shared/types'
import { EntityType, MediaType } from '@/modules/media/enums'
import { IngestMediaFromPathUseCase } from '@/modules/media/use-cases'

interface ClaimWithReview {
  id: string
  field: string
  value: string
  decision: ClaimReviewDecision
  replacementEntityId: string | null
  replacementValue: string | null
}

interface ResolvedClaim {
  field: MetadataClaimField
  value: string | null
  entityId: string | null
}

export interface PromoteImportJobItemUseCaseParams {
  importJobItemId: string
  userId: string
}

export interface PromoteImportJobItemUseCaseResult {
  id: string
}

@Injectable()
export class PromoteImportJobItemUseCase
  implements UseCase<PromoteImportJobItemUseCaseParams, PromoteImportJobItemUseCaseResult>
{
  constructor(
    private readonly importJobItemRepository: ImportJobItemRepository,
    private readonly metadataClaimRepository: MetadataClaimRepository,
    private readonly metadataClaimReviewRepository: MetadataClaimReviewRepository,
    private readonly getImportJobItemPromotionEligibilityUseCase: GetImportJobItemPromotionEligibilityUseCase,
    private readonly createBackstageArtistUseCase: CreateBackstageArtistUseCase,
    private readonly createBackstageAlbumUseCase: CreateBackstageAlbumUseCase,
    private readonly createBackstageTrackUseCase: CreateBackstageTrackUseCase,
    private readonly ingestMediaFromPathUseCase: IngestMediaFromPathUseCase,
  ) {}

  async invoke(params: PromoteImportJobItemUseCaseParams): Promise<PromoteImportJobItemUseCaseResult> {
    const item = await this.importJobItemRepository.findOne(params.importJobItemId)

    if (!item) {
      throw new NotFoundException('Import job item not found')
    }

    const eligibility = await this.getImportJobItemPromotionEligibilityUseCase.invoke({
      importJobItemId: params.importJobItemId,
    })

    if (!eligibility.isEligible) {
      throw new BadRequestException(
        `Import item is not eligible for promotion. Unresolved fields: ${eligibility.unresolvedRequiredFields.join(', ')}`,
      )
    }

    const claims = await this.loadClaimsWithReviews(params.importJobItemId)
    const titleClaim = this.resolveClaimValue(this.pickClaim(claims, MetadataClaimField.Title), MetadataClaimField.Title)
    const artistClaim = this.resolveClaimValue(this.pickClaim(claims, MetadataClaimField.Artist), MetadataClaimField.Artist)
    const albumClaim = this.resolveClaimValue(this.pickClaim(claims, MetadataClaimField.Album), MetadataClaimField.Album)
    const releaseDateClaim = this.resolveClaimValue(
      this.pickClaim(claims, MetadataClaimField.ReleaseDate),
      MetadataClaimField.ReleaseDate,
    )

    if (!titleClaim.value && !titleClaim.entityId) {
      throw new BadRequestException('Promotion requires resolved title claim')
    }

    if (!artistClaim.value && !artistClaim.entityId) {
      throw new BadRequestException('Promotion requires resolved artist claim')
    }

    const artistId = await this.resolveArtistId(artistClaim, params.userId)

    const releaseDate = this.parseReleaseDate(releaseDateClaim.value)
    const albumId = await this.resolveAlbumId({
      albumClaim,
      fallbackAlbumName: titleClaim.value ?? 'Imported release',
      releaseDate,
      userId: params.userId,
    })

    const trackId = await this.resolveTrackId({
      titleClaim,
      albumId,
      releaseDate,
      userId: params.userId,
    })

    if (item.audioPath) {
      await this.ingestMediaFromPathUseCase.invoke({
        filePath: item.audioPath,
        mediaType: MediaType.Audio,
        entityType: EntityType.Track,
        entityId: trackId,
        userId: params.userId,
      })
    }

    if (item.artworkPath) {
      await this.ingestMediaFromPathUseCase.invoke({
        filePath: item.artworkPath,
        mediaType: MediaType.Image,
        entityType: EntityType.Track,
        entityId: trackId,
        userId: params.userId,
      })
    }

    return {
      id: item.id,
    }
  }

  private async loadClaimsWithReviews(importJobItemId: string): Promise<ClaimWithReview[]> {
    const claims = await this.metadataClaimRepository.findByImportJobItemId(importJobItemId)
    const reviews = await this.metadataClaimReviewRepository.findByMetadataClaimIds(claims.map((claim) => claim.id))
    const reviewByClaimId = new Map(reviews.map((review) => [review.metadataClaimId, review]))

    return claims.map((claim) => {
      const review = reviewByClaimId.get(claim.id)
      return {
        id: claim.id,
        field: claim.field,
        value: claim.value,
        decision: (review?.decision ?? ClaimReviewDecision.Pending) as ClaimReviewDecision,
        replacementEntityId: review?.replacementEntityId ?? null,
        replacementValue: review?.replacementValue ?? null,
      }
    })
  }

  private pickClaim(claims: ClaimWithReview[], field: MetadataClaimField): ClaimWithReview | null {
    return claims.find((claim) => claim.field === field) ?? null
  }

  private resolveClaimValue(claim: ClaimWithReview | null, field: MetadataClaimField): ResolvedClaim {
    if (!claim) {
      return {
        field,
        value: null,
        entityId: null,
      }
    }

    switch (claim.decision) {
      case ClaimReviewDecision.LinkExisting:
        return {
          field,
          value: null,
          entityId: claim.replacementEntityId,
        }
      case ClaimReviewDecision.CreateNew:
        return {
          field,
          value: claim.replacementValue ?? claim.value,
          entityId: null,
        }
      case ClaimReviewDecision.Ignore:
        return {
          field,
          value: claim.replacementValue ?? null,
          entityId: claim.replacementEntityId ?? null,
        }
      case ClaimReviewDecision.Reject:
      case ClaimReviewDecision.Pending:
      default:
        return {
          field,
          value: null,
          entityId: null,
        }
    }
  }

  private async resolveArtistId(artistClaim: ResolvedClaim, userId: string): Promise<string> {
    if (artistClaim.entityId) {
      return artistClaim.entityId
    }

    if (!artistClaim.value) {
      throw new BadRequestException('Artist claim did not resolve to a value')
    }

    const artist = await this.createBackstageArtistUseCase.invoke({
      name: artistClaim.value,
      verified: false,
      genres: [],
      userId,
    })

    return artist.id
  }

  private async resolveAlbumId(params: {
    albumClaim: ResolvedClaim
    fallbackAlbumName: string
    releaseDate: Date
    userId: string
  }): Promise<string> {
    if (params.albumClaim.entityId) {
      return params.albumClaim.entityId
    }

    const albumName = params.albumClaim.value ?? `${params.fallbackAlbumName} (Imported)`
    const albumType = Object.values(AlbumType)[0]

    const album = await this.createBackstageAlbumUseCase.invoke({
      name: albumName,
      releaseDate: params.releaseDate,
      explicit: false,
      type: albumType,
      genres: [],
      userId: params.userId,
    })

    return album.id
  }

  private async resolveTrackId(params: {
    titleClaim: ResolvedClaim
    albumId: string
    releaseDate: Date
    userId: string
  }): Promise<string> {
    if (params.titleClaim.entityId) {
      return params.titleClaim.entityId
    }

    if (!params.titleClaim.value) {
      throw new BadRequestException('Title claim did not resolve to a value')
    }

    const trackType = Object.values(TrackType)[0]

    const track = await this.createBackstageTrackUseCase.invoke({
      name: params.titleClaim.value,
      albumId: params.albumId,
      trackNumber: 1,
      diskNumber: 1,
      releaseDate: params.releaseDate,
      type: trackType,
      explicit: false,
      genres: [],
      userId: params.userId,
    })

    return track.id
  }

  private parseReleaseDate(value: string | null): Date {
    if (!value) {
      return new Date()
    }

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? new Date() : date
  }
}
