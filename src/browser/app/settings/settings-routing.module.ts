import { NgModule } from '@angular/core'
import { AppHomeComponent } from './settings.component'
import { RouterModule } from '@angular/router'

const children = [
  { path: '', component: AppHomeComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(children)
  ],
  exports: [RouterModule]
})
export class AppHomeRoutingModule { }
