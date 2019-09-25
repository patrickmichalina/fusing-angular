import { NgModule } from '@angular/core'
import { SharedBrowserModule } from '../shared/shared.browser.module'
import { SharedModule } from '../shared/shared.module'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    SharedBrowserModule,
  ],
  exports: [
    SharedModule,
    SharedBrowserModule,
  ]
})
export class AppBrowserModule { }