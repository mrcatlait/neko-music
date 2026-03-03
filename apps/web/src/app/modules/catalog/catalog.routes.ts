import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./browse/browse-page').then((c) => c.BrowsePage),
  },
]
