import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FusingModule } from './fusing/fusing.module'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    CommonModule,
    FusingModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FusingModule,
    RouterModule
  ]
})
export class SharedModule { }