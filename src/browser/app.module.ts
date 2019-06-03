import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import { SharedModule } from './shared.module'

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    NotFoundModule,
    SharedModule,
    BrowserModule.withServerTransition({ appId: 'my-app' })
  ],
  exports: [CommonModule]
})
export class AppModule { }