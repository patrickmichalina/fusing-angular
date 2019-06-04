import { NgModule } from '@angular/core'
import { HomeModule } from './home.module'
import { HttpClientModule } from '@angular/common/http'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

@NgModule({
  imports: [HomeModule, HttpClientModule, NodeEnvTransferBrowserModule],
  exports: [HomeModule],
})
export class HomeTestingModule { }
