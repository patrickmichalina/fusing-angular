import { platformBrowser } from '@angular/platform-browser'
import { AppBrowserModuleNgFactory } from './.ngc/src/browser/app.browser.module.ngfactory.js'

document.addEventListener('DOMContentLoaded', () => {
  platformBrowser()
    .bootstrapModuleFactory(AppBrowserModuleNgFactory)
    .catch(console.log)
})
