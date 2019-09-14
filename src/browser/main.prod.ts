import 'zone.js/dist/zone'
import 'core-js/proposals/reflect-metadata'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { SiteBrowserModule } from './site/site.browser.module'
import { enableProdMode } from '@angular/core'

enableProdMode()

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(SiteBrowserModule)
    .catch(console.error)
})
