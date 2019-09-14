import { NgModule } from '@angular/core'
import { HomeModule } from './home.module'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { FloNodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

@NgModule({
  imports: [HomeModule, HttpClientTestingModule, FloNodeEnvTransferBrowserModule],
  exports: [HomeModule],
})
export class HomeTestingModule { }
