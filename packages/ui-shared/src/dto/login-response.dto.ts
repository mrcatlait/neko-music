export interface LoginResponseDto {
  user: {
    id: string
    username: string
  }
  accessToken: string
}
