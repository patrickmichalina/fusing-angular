import { NgModule } from '@angular/core'
import { RootModule } from './root.module'
import { RootComponent } from './root.component'
import { SharedBrowserModule } from './shared/shared.browser.module'

@NgModule({
  imports: [
    SharedBrowserModule,
    RootModule
  ],
  bootstrap: [RootComponent]
})
export class RootBrowserModule { }