import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule } from '@angular/platform-browser'
import { SharedModule } from './shared/shared.module'
import { TranslateModule } from '@ngx-translate/core'
import { PreserveQueryParamsDirective, RouterLinkLangDirective } from './param-router-link.directive'
import { NodeEnvTransferModule } from '@flosportsinc/ng-env-transfer-state'

@NgModule({
  declarations: [AppComponent, PreserveQueryParamsDirective, RouterLinkLangDirective],
  imports: [
    AppRoutingModule,
    NotFoundModule,
    SharedModule,
    TranslateModule,
    NodeEnvTransferModule.config({
      useValues: {
        APP_VERSION: "__APPVERSION__" // to sync server/web version to the electron version. Otherwise recommend using Node Environment variable.
      }
    }),
    BrowserModule.withServerTransition({ appId: 'my-app' })
  ]
})
export class AppModule { }