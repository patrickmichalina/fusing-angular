
import { NgModule } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry, MatIconModule, MatToolbarModule } from '@angular/material'
import { PlatformService } from './platform.service'

@NgModule({
  imports: [
    MatIconModule,
    MatToolbarModule
  ],
  exports: [
    MatIconModule,
    MatToolbarModule
  ]
})
export class MaterialModule {
  constructor(matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer, ps: PlatformService) {
    matIconRegistry .addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl('./mdi.svg'))
  }
}
