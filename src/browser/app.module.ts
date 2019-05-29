import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule } from '@angular/platform-browser'
import { NodeEnvTransferModule } from '@flosportsinc/ng-env-transfer-state'
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    NotFoundModule,
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    NodeEnvTransferModule,
  ]
})
export class AppModule { }