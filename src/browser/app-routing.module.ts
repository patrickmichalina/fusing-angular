import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeModule } from './home/home.module'
import { NotFoundModule } from './not-found/not-found.module'
import { APP_BASE_HREF } from '@angular/common'
import { isElectron, getBaseRef } from './app-routing.electron'

export function aboutModule() {
  return import('./about/about.module').then(m => m.AboutModule)
}

export const routes: Routes = [
  {
    path: 'about',
    loadChildren: aboutModule
  }
]

@NgModule({
  imports: [
    HomeModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled', useHash: isElectron() }),
    NotFoundModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useFactory: getBaseRef }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
