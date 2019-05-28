import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    NotFoundModule,
    BrowserModule.withServerTransition({ appId: 'my-app' })
  ]
})
export class AppModule { }