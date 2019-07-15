
import { NgModule } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry, MatIconModule } from '@angular/material'
import { PlatformService } from './platform.service'

@NgModule({
  imports: [
    MatIconModule
  ],
  exports: [
    MatIconModule
  ]
})
export class MaterialModule {
  constructor(matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer, ps: PlatformService) {
    matIconRegistry .addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl('./mdi.svg'))
  }
}
