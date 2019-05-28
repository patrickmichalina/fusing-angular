import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    NotFoundModule
  ]
})
export class AppModule { }