import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    AppRoutingModule
  ]
})
export class AppModule { }