import { PagePaginationMetadata } from './page-pagination-metadata'

export interface ListResponse<T> {
  data: T[]
  metadata: PagePaginationMetadata
}
