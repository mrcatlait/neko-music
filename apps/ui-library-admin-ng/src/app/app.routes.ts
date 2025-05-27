import { Routes } from '@angular/router'
import { canActivateGuest, canActivateAuthorized } from '@neko/ui-auth/guards'

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home').then((c) => c.HomePage),
        pathMatch: 'full',
      },
      {
        path: 'artists',
        loadComponent: () => import('./pages/artists/artist-list/artist-list.component').then((c) => c.ArtistListPage),
      },
      // {
      //   path: 'artists/:id',
      //   loadComponent: () => import('./pages/artist-details').then((c) => c.ArtistDetailsPage),
      // },
      // {
      //   path: 'library',
      //   loadComponent: () => import('./pages/library').then((c) => c.LibraryPage),
      // },
    ],
  },
  {
    path: '404',
    pathMatch: 'full',
    loadComponent: () => import('./pages/not-found').then((c) => c.NotFoundPage),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
]
