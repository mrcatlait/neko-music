import { Routes } from '@angular/router'

export const catalogRoutes: Routes = [
  {
    path: 'artists',
    children: [
      {
        path: '',
        loadComponent: () => import('./artists/artists-page').then((c) => c.ArtistsPage),
        pathMatch: 'full',
      },
    ],
  },
]
