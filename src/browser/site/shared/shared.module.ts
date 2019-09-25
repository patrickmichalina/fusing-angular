import { NgModule } from '@angular/core'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    SharedModule
  ]
})
export class SharedSiteModule { }