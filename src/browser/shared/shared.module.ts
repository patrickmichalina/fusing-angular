import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { FusingModule } from './fusing/fusing.module'
import { NotFoundModule } from './not-found/not-found.module'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TransferHttpCacheModule,
    FusingModule,
    NotFoundModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TransferHttpCacheModule,
    FusingModule,
    NotFoundModule
  ]
})
export class SharedModule { }