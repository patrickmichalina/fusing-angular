
import { NgModule } from '@angular/core'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

@NgModule({
  imports: [
    AppModule,
    NodeEnvTransferBrowserModule
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }