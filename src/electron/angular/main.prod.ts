import 'zone.js/dist/zone'
import { platformBrowser } from '@angular/platform-browser'
import { AppElectronModule } from './app.electron.module'
import { enableProdMode } from '@angular/core'

enableProdMode()

platformBrowser()
  .bootstrapModule(AppElectronModule)
  .catch(console.error)
