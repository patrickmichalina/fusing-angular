
import { NgModule } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material'

@NgModule({
  imports: [
  ],
  exports: [
  ]
})
export class MaterialModule {
  constructor(matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    matIconRegistry
      .addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl('./mdi.svg'))
  }
}
