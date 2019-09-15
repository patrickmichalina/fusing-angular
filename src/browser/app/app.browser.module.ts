import { NgModule } from '@angular/core'
import { SharedBrowserModule } from '../shared/shared.browser.module'
import { AppModule } from './app.module'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  imports: [
    SharedModule,
    SharedBrowserModule,
    AppModule
  ]
})
export class AppBrowserModule { }