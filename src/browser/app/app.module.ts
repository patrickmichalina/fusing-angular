import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SharedAppModule } from './shared/shared.module'

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    SharedModule,
    SharedAppModule
  ]
})
export class AppModule { }