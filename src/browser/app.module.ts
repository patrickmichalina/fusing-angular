import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { NotFoundModule } from './not-found/not-found.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
// BrowserAnimationsModule,

@NgModule({
  imports: [
    AppRoutingModule,
    HomeModule,
    NotFoundModule,
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    TransferHttpCacheModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }