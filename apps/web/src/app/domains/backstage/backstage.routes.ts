import { Permissions } from '@neko/permissions'
import { Routes } from '@angular/router'

import { canActivateWithPermissions } from '@/core/guards'

export const routes: Routes = [
  {
    path: 'genres',
    canActivate: [canActivateWithPermissions([Permissions.Genre.Write])],
    loadChildren: () => import('./genres/genres.routes').then((c) => c.routes),
  },
  {
    path: 'artists',
    canActivate: [canActivateWithPermissions([Permissions.Artist.Write])],
    loadChildren: () => import('./artists/artists.routes').then((c) => c.routes),
  },
]
