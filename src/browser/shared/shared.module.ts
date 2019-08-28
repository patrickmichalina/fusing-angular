import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { TransferHttpCacheModule } from '@nguniversal/common'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TransferHttpCacheModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TransferHttpCacheModule
  ]
})
export class SharedModule { }