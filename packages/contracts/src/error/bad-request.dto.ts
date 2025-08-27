export interface BadRequestDto {
  readonly message: string | string[]
  readonly error: string
  readonly statusCode: number
}
