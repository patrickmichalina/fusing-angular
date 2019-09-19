import { NgModule } from '@angular/core'
import { SiteModule } from './site.module'
import { SiteComponent } from './site.component'
import { SharedBrowserModule } from '../shared/shared.browser.module'

@NgModule({
  imports: [
    SiteModule,
    SharedBrowserModule
  ],
  bootstrap: [SiteComponent]
})
export class SiteBrowserModule { }