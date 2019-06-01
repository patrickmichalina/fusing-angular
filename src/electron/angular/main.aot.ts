import { platformBrowser } from '@angular/platform-browser'
import { AppElectronModuleNgFactory } from './.ngc/src/electron/angular/app.electron.module.ngfactory.js'

platformBrowser()
  .bootstrapModuleFactory(AppElectronModuleNgFactory)
  .catch(console.log)
