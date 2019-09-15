import 'zone.js/dist/zone'
import { platformBrowser } from '@angular/platform-browser'
import { SiteBrowserModule } from './site/site.browser.module'
import { enableProdMode } from '@angular/core'

enableProdMode()

document.addEventListener('DOMContentLoaded', () => {
  platformBrowser()
    .bootstrapModule(SiteBrowserModule)
    .catch(console.error)
})
