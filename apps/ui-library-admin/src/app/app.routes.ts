import { Routes } from '@angular/router'

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
    ],
  },
  // {
  //   path: '',
  //   canActivateChild: [],
  //   children: [
  //     {
  //       path: 'login',
  //       pathMatch: 'full',
  //       loadComponent: () => import('./pages/login').then((c) => c.LoginPage),
  //     },
  //   ],
  // },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
]
