import { NgModule } from '@angular/core'
import { AppSettingsComponent } from './settings.component'
import { AppSettingsRoutingModule } from './settings-routing.module'

@NgModule({
  imports: [AppSettingsRoutingModule],
  exports: [AppSettingsComponent],
  declarations: [AppSettingsComponent]
})
export class SettingsModule { }
