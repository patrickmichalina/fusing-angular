import { NgModule } from '@angular/core'
import { SharedBrowserModule } from '../shared/shared.browser.module'
import { AppModule } from './app.module'

@NgModule({
  imports: [
    SharedBrowserModule,
    AppModule
  ]
})
export class AppBrowserModule { }