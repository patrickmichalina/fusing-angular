import 'zone.js/dist/zone'
import 'core-js/proposals/reflect-metadata'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppElectronModule } from './app.electron.module'

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppElectronModule)
    .catch(console.log)
})
