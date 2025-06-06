import { NgModule } from '@angular/core'
import { PreloadAllModules, Route, RouterModule, TitleStrategy } from '@angular/router'

import { Layout } from '@core/enum'
import { canActivateAuthorized, canActivateGuest } from '@core/guards'
import { PageTitleStrategy } from '@core/strategies'

interface RouteWithLayout extends Route {
  data?: {
    layout: Layout
  }
}

export const routes: RouteWithLayout[] = [
  {
    path: '',
    canActivateChild: [canActivateAuthorized],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home').then((c) => c.HomePage),
        pathMatch: 'full',
      },
      {
        path: 'artists/:id',
        loadComponent: () => import('./pages/artist-details').then((c) => c.ArtistDetailsPage),
      },
      {
        path: 'library',
        loadComponent: () => import('./pages/library').then((c) => c.LibraryPage),
      },
    ],
  },
  {
    path: '',
    canActivateChild: [canActivateGuest],
    data: {
      layout: Layout.MINIMAL,
    },
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
