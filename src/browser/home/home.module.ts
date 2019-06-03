import { NgModule } from '@angular/core'
import { HomeComponent } from './home.component'
import { HomeRoutingModule } from './home-routing.module'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

@NgModule({
  imports: [HomeRoutingModule, CommonModule, HttpClientModule, NodeEnvTransferBrowserModule],
  exports: [HomeComponent],
  declarations: [HomeComponent]
})
export class HomeModule { }
