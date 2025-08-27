import { SetMetadata } from '@nestjs/common'

export const PERMISSIONS_METADATA_KEY = 'permissions'

/**
 * Require specific permissions (all must be present)
 * @param permissions - Array of permission strings
 * @example
 * ```ts
 * \@Post('')
 * \@RequirePermissions('albums:create')
 * createAlbum(@Body() body: AlbumCreationRequest): Promise<AlbumResponse> {
 *   // ...
 * }
 * ```
 */
export const RequirePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_METADATA_KEY, permissions)
