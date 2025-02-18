interface HttpParams {
  [param: string]: string | number
}

export interface PageOptionsDto extends HttpParams {
  take: number
  offset: number
}
