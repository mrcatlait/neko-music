export interface RefreshTokenEntity {
  id: string
  refresh_token: string
  expires_at: Date
  user_id: string
}
