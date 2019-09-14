import { NgModule } from '@angular/core'
import { AboutComponent } from './about.component'
import { AboutRoutingModule } from './about-routing.module'

@NgModule({
  imports: [AboutRoutingModule],
  exports: [AboutComponent],
  declarations: [AboutComponent]
})
export class AboutModule { }
