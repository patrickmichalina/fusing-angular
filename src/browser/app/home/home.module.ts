import { NgModule } from '@angular/core'
import { AppHomeComponent } from './home.component'
import { AppHomeRoutingModule } from './home-routing.module'

@NgModule({
  imports: [AppHomeRoutingModule],
  exports: [AppHomeComponent],
  declarations: [AppHomeComponent]
})
export class HomeModule { }
