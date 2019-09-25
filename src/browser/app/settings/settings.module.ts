import { NgModule } from '@angular/core'
import { AppHomeComponent } from './settings.component'
import { AppHomeRoutingModule } from './settings-routing.module'

@NgModule({
  imports: [AppHomeRoutingModule],
  exports: [AppHomeComponent],
  declarations: [AppHomeComponent]
})
export class SettingsModule { }
