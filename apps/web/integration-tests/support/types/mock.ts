type HttpMethod = 'get' | 'post' | 'put' | 'delete'

export interface RequestMock {
  url: string
  method: HttpMethod
  data: any
}
