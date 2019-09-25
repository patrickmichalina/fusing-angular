import { NgModule } from '@angular/core'
import { AppHomeComponent } from './home.component'
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
