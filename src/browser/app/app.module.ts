import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SharedAppModule } from './shared/shared.module'

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    SharedAppModule
  ]
})
export class AppModule { }