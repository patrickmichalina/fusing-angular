import { NgModule } from '@angular/core'
import { HomeModule } from './home.module'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

@NgModule({
  imports: [HomeModule, HttpClientTestingModule, NodeEnvTransferBrowserModule],
  exports: [HomeModule],
})
export class HomeTestingModule { }
