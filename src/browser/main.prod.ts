import 'zone.js/dist/zone'
import { platformBrowser } from '@angular/platform-browser'
import { AppBrowserModule } from './app.browser.module'
import { enableProdMode } from '@angular/core'

enableProdMode()

platformBrowser()
  .bootstrapModule(AppBrowserModule)
  .catch(console.error)
