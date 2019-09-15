import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: AppComponent }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
