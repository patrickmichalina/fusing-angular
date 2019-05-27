import { platformBrowser } from '@angular/platform-browser'
import { AppModuleNgFactory } from './.ngc/src/browser/app.module.ngfactory.js'

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
