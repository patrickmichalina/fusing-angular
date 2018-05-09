import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component'
import { HomeComponent, TestComponent, NotFoundComponent } from './home.component'
import { TransferHttpCacheModule } from '@nguniversal/common'
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
 
@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    HomeComponent,
    NotFoundComponent
  ],
  imports: [
    // BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'test', component: TestComponent },
      { path: '**', component: NotFoundComponent }
    ], { initialNavigation: true }),
    TransferHttpCacheModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }