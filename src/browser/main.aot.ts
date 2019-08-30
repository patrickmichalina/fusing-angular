import 'zone.js/dist/zone'
import { platformBrowser } from '@angular/platform-browser'
import { AppBrowserModule } from './app.browser.module'

document.addEventListener('DOMContentLoaded', () => {
  platformBrowser()
    .bootstrapModule(AppBrowserModule)
    .catch(console.error)
})