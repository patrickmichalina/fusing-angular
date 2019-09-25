import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { FusingModule } from './fusing/fusing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TransferHttpCacheModule,
    FusingModule,
    RouterModule
    // NotFoundModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TransferHttpCacheModule,
    FusingModule,
    RouterModule
    // NotFoundModule
  ]
})
export class SharedModule { }