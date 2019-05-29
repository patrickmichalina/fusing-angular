
import { NgModule } from '@angular/core'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

@NgModule({
  imports: [
    AppModule,
    NodeEnvTransferBrowserModule,
    
    TransferHttpCacheModule,
    
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }