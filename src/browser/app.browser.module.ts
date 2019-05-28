
import { NgModule } from '@angular/core'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { AppModule } from './app.module';
import { AppComponent } from './app.component'

@NgModule({
  imports: [
    AppModule,
    TransferHttpCacheModule
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }