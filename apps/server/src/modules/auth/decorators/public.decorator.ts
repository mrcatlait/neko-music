import { SetMetadata } from '@nestjs/common'

export const PUBLIC_METADATA_KEY = 'public'

/**
 * Mark a route as public (no authentication required)
 * @example
 * ```ts
 * \@Post('')
 * \@Public()
 * login(@Body() body: LoginRequest): Promise<LoginResponse> {
 *   // ...
 * }
 * ```
 */
export const Public = () => SetMetadata(PUBLIC_METADATA_KEY, true)
