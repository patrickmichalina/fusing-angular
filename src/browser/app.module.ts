import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { NotFoundModule } from './not-found/not-found.module'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { HomeModule } from './home/home.module'
import { APP_BASE_HREF } from '@angular/common'
// import { AboutModule } from './about/about.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
// BrowserAnimationsModule,

export function getBaseRef() {
  return typeof window !== 'undefined' && typeof (window as any).process === 'object' && (window as any).type === 'renderer'
    ? ''
    : '/'
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    HomeModule,
    // AboutModule,
    NotFoundModule,
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    TransferHttpCacheModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useFactory: getBaseRef }
  ]
})
export class AppModule { }