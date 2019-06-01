import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppElectronModule } from './app.electron.module'

platformBrowserDynamic()
  .bootstrapModule(AppElectronModule)
  .catch(console.log)
