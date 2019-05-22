import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

export function homeModule() {
  return import('./home/home.module').then(m => m.HomeModule)
}

export const routes: Routes = [
  {
    path: '',
    loadChildren: homeModule
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}


// RouterModule.forRoot([
//   { path: '', component: HomeComponent },
//   { path: 'test', component: TestComponent },
//   { path: '**', component: NotFoundComponent }
// ], { initialNavigation: true }),