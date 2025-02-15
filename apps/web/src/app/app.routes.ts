import { Routes } from '@angular/router'
import { canActivateGuest, canActivateAuthorized } from '@neko/ui-auth/guards'

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [canActivateAuthorized],
    loadComponent: () => import('./features/layout').then((c) => c.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home').then((c) => c.HomePage),
        pathMatch: 'full',
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
    path: '',
    canActivateChild: [canActivateGuest],
    children: [
      {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => import('./pages/login').then((c) => c.LoginPage),
      },
      {
        path: 'registration',
        pathMatch: 'full',
        loadComponent: () => import('./pages/registration').then((c) => c.RegistrationPage),
      },
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
