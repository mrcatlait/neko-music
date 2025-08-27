export interface SocialAuthOptions {
  clientId: string
  clientSecret: string
  callbackUrl: string
  scopes?: string[]
}

// export interface AuthenticationStrategy {
//   /**
//    * Initiates the authentication flow
//    */
//   authenticate(request: FastifyRequest, reply: FastifyReply): Promise<AuthenticationResult | void>

//   /**
//    * Handles the callback from external providers (for social auth)
//    */
//   handleCallback?(request: FastifyRequest, reply: FastifyReply): Promise<AuthenticationResult>

//   /**
//    * Validates the strategy configuration
//    */
//   validateConfig(): boolean

//   /**
//    * Gets the redirect URL for social auth
//    */
//   getAuthUrl?(state?: string): string
// }

// export interface AuthenticationResult {
//   user: UserSession
//   accessToken: string
//   refreshToken: string
//   isNewUser: boolean
//   requiresAdditionalInfo?: boolean
//   additionalData?: Record<string, any>
// }

// export interface SocialUserProfile {
//   providerId: string
//   providerType: AuthStrategyType
//   email: string
//   displayName: string
//   firstName?: string
//   lastName?: string
//   profilePicture?: string
//   additionalData?: Record<string, any>
// }
