import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

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
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
