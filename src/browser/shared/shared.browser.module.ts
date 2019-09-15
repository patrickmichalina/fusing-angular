import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FloNodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FloNodeEnvTransferBrowserModule
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    FloNodeEnvTransferBrowserModule
  ]
})
export class SharedBrowserModule { }