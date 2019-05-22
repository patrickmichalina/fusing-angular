import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

export function homeModule() {
  return import('./home/home.module').then(m => {
    console.log(m)
    return m.HomeModule
  })
}

export function aboutModule() {
  return import('./about/about.module').then(m => {
    console.log(m)
    return m.AboutModule
  })
}

export const routes: Routes = [
  {
    path: '',
    loadChildren: homeModule
  },
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
