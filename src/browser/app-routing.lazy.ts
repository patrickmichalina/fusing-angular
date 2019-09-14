import { Routes } from '@angular/router'

export const lazyRoutes: Routes = [
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) }
]
