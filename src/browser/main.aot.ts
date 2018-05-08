import { platformBrowser } from '@angular/platform-browser'
import { AppModuleNgFactory } from './.aot/src/browser/app.module.ngfactory.js'
import { enableProdMode } from '@angular/core';

enableProdMode()

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
