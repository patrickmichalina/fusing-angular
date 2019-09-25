import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component'

export const children = [{
  path: '',
  component: AppComponent,
  children: [
    { path: '', pathMatch: 'full', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
    { path: '**', redirectTo: '' }
  ]
}]

@NgModule({
  imports: [
    RouterModule.forChild(children)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
