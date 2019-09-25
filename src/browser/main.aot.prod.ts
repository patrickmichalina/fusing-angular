import 'zone.js/dist/zone'
import { platformBrowser } from '@angular/platform-browser'
import { enableProdMode } from '@angular/core'
import { RootBrowserModule } from './root.browser.module'

enableProdMode()

document.addEventListener('DOMContentLoaded', () => {
  platformBrowser()
    .bootstrapModule(RootBrowserModule)
    .catch(console.error)
})
