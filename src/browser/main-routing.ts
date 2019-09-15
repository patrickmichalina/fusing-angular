import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadChildren: () => import('./site/home/home.module').then(m => m.HomeModule) },
  { path: 'app', loadChildren: () => import('./app/app.module').then(m => m.AppModule) },
  { path: 'about', loadChildren: () => import('./site/about/about.module').then(m => m.AboutModule) }
]