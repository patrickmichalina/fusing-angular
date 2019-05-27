import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
// import { AboutModule } from './about/about.module';


@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    // AboutModule,
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    TransferHttpCacheModule
  ]
})
export class AppModule { }