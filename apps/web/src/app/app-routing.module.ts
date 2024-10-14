import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes, TitleStrategy } from '@angular/router'

import { PageTitleStrategy } from '@core/strategies'

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true, preloadingStrategy: PreloadAllModules })],
  providers: [
    {
      provide: TitleStrategy,
      useClass: PageTitleStrategy,
    },
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
