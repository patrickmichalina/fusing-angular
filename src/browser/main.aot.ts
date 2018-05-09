import { platformBrowser } from '@angular/platform-browser'
import { AppModuleNgFactory } from './.aot/src/browser/app.module.ngfactory.js'

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
