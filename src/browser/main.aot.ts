import 'zone.js/dist/zone'
import { platformBrowser } from '@angular/platform-browser'
import { RootBrowserModule } from './root.browser.module'

document.addEventListener('DOMContentLoaded', () => {
  platformBrowser()
    .bootstrapModule(RootBrowserModule)
    .catch(console.error)
})