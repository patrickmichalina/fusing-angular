import { NgModule } from '@angular/core'
import { AppSettingsComponent } from './settings.component'
import { RouterModule } from '@angular/router'

const children = [
  { path: '', component: AppSettingsComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(children)
  ],
  exports: [RouterModule]
})
export class AppSettingsRoutingModule { }
