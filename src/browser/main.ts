import 'zone.js/dist/zone'
import 'core-js/proposals/reflect-metadata'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { SiteBrowserModule } from './site/site.browser.module'

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
  .bootstrapModule(SiteBrowserModule)
  .catch(console.error)
})