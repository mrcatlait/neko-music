export interface PageResponseDto<Type> {
  data: Type[]
  meta: {
    take: number
    offset: number
    itemCount: number
    pageCount: number
  }
}
