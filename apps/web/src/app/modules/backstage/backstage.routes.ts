import { Permissions } from '@neko/permissions'
import { Routes } from '@angular/router'

import { withPermissionsGuard } from '@/core/auth/guards'

export const routes: Routes = [
  {
    path: 'genres',
    canActivate: [withPermissionsGuard([Permissions.Genre.Write])],
    loadChildren: () => import('./genre/genre.routes').then((c) => c.routes),
  },
  {
    path: 'artists',
    canActivate: [withPermissionsGuard([Permissions.Artist.Write])],
    loadChildren: () => import('./artist/artist.routes').then((c) => c.routes),
  },
  {
    path: 'tracks',
    canActivate: [withPermissionsGuard([Permissions.Track.Write])],
    loadChildren: () => import('./track/track.routes').then((c) => c.routes),
  },
]
