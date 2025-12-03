export interface AuthModuleOptions {
  /**
   * The secret key for the JWT access token.
   */
  accessTokenSecret: string
  /**
   * The expiration time for the JWT access token.
   */
  accessTokenExpiresIn: string
  /**
   * The name of the header for the JWT access token.
   * @default 'authorization'
   */
  accessTokenHeaderName?: string
  /**
   * The secret key for the JWT refresh token.
   */
  refreshTokenSecret: string
  /**
   * The expiration time for the JWT refresh token.
   */
  refreshTokenExpiresIn: string
  /**
   * The name of the cookie for the JWT refresh token.
   * @default 'n-refresh-token'
   */
  refreshTokenCookieName?: string
  /**
   * The number of salt rounds for the password hash.
   * @default 10
   */
  saltRounds: number
}
