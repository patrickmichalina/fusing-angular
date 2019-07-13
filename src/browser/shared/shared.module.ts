import { NgModule } from '@angular/core'
import { FloNodeEnvTransferModule } from '@flosportsinc/ng-env-transfer-state'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { PlatformService } from './platform.service'
import { EnvironmentService } from './environment.service'
import { ElectronService } from './electron.service'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TransferHttpCacheModule,
    FloNodeEnvTransferModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TransferHttpCacheModule,
    FloNodeEnvTransferModule
  ],
  providers: [
    PlatformService,
    EnvironmentService,
    ElectronService
  ]
})
export class SharedModule { }