export interface FindAllOptions {
  limit?: number
  offset?: number
}

export interface FindAllResult<T> {
  data: T[]
  count: number
}
