import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { NotFoundModule } from './not-found/not-found.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { AppRoutingModule } from './app-routing.module';
import { AboutModule } from './about/about.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
// BrowserAnimationsModule,

@NgModule({
  imports: [
    AppRoutingModule,
    HomeModule,
    AboutModule,
    NotFoundModule,
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    TransferHttpCacheModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }