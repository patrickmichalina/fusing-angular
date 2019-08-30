import 'zone.js/dist/zone'
import 'core-js/proposals/reflect-metadata'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppElectronModule } from './app.electron.module'
import { enableProdMode } from '@angular/core'

enableProdMode()

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppElectronModule)
    .catch(console.error)
})
