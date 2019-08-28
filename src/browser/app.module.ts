import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule } from '@angular/platform-browser'
import { SharedModule } from './shared/shared.module'
import { PreserveQueryParamsDirective, RouterLinkLangDirective } from './param-router-link.directive'
import { FusingModule } from './shared/fusing.module'

@NgModule({
  declarations: [AppComponent, PreserveQueryParamsDirective, RouterLinkLangDirective],
  imports: [
    SharedModule,
    FusingModule,
    BrowserModule.withServerTransition({ appId: 'pm-app' }),
    AppRoutingModule,
    NotFoundModule
  ]
})
export class AppModule { }