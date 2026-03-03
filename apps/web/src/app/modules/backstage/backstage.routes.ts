import { Permissions } from '@neko/permissions'
import { Routes } from '@angular/router'

import { withPermissionsGuard } from '@/core/auth/guards'

export const routes: Routes = [
  {
    path: 'genres',
    canActivate: [withPermissionsGuard([Permissions.Genre.Write])],
    loadChildren: () => import('./genres/genres.routes').then((c) => c.routes),
  },
  {
    path: 'artists',
    canActivate: [withPermissionsGuard([Permissions.Artist.Write])],
    loadChildren: () => import('./artists/artists.routes').then((c) => c.routes),
  },
]
