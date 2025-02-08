import { PageOptionsDto } from '../dtos'
import { Pagination } from '../models'

export class PaginationMapper {
  static toPaginatedResponse<T>(data: T[], pageOptions: PageOptionsDto): Pagination<T> {
    const hasMore = data.length > pageOptions.take - 1

    if (hasMore) {
      data.pop()
    }

    return {
      data,
      hasMore,
    }
  }
}
