import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { AppModule } from './app.module';
import { AppComponent } from './app.component'

@NgModule({
  imports: [
    AppModule,
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    TransferHttpCacheModule
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }