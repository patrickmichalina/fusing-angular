import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppBrowserModule } from './app.browser.module'

platformBrowserDynamic()
  .bootstrapModule(AppBrowserModule)
  .catch(console.error)
