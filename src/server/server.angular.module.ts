import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { AppModule } from '../browser/app.module'
import { AppComponent } from '../browser/app.component'
import { enableProdMode } from '@angular/core'

enableProdMode()

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
}