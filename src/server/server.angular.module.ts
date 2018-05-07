import 'reflect-metadata'
import 'zone.js/dist/zone-node'
import 'zone.js/dist/long-stack-trace-zone'
import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { enableProdMode } from '@angular/core'
import { AppModule } from '../browser/app.module'
import { AppComponent } from '../browser/app.component'

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