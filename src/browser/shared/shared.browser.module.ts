import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FloNodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'
import { LoggingBrowserModule } from './fusing/logging/logging.browser.module'
import { ServiceWorkerModule } from '@angular/service-worker'

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FloNodeEnvTransferBrowserModule,
    LoggingBrowserModule
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    FloNodeEnvTransferBrowserModule,
    LoggingBrowserModule
  ]
})
export class SharedBrowserModule { }