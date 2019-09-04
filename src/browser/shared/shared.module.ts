import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { FusingModule } from './fusing/fusing.module'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TransferHttpCacheModule,
    FusingModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TransferHttpCacheModule,
    FusingModule
  ]
})
export class SharedModule { }