import { ImageDto } from '@core/dto'

export interface CollectionMembershipDto {
  id: string
  name: string
  images: ImageDto[]
  membership: {
    total: number
    existing: number
  }
}
