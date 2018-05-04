import 'reflect-metadata'
import 'zone.js/dist/zone-node'
import 'zone.js/dist/long-stack-trace-zone'
import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import { AppModule } from '../browser/app.module';
import { AppComponent } from '../browser/app.component';
// import { AppModule } from '../app.module';
// import { AppComponent } from '../app.component';
// import { FaviconComponent } from './favicon.component';
// import { JavascriptComponent } from './javascript.component';
// import { RouteDataService } from '../route-data.service'
// import { filter } from 'rxjs/operators';
// import { NavigationEnd } from '@angular/router';
// import { take } from 'rxjs/operators';
enableProdMode()

@NgModule({
  imports: [
    AppModule,
    // RouterModule.forRoot([
    //   { path: 'favicon.ico', component: FaviconComponent },
    //   { path: 'js/:filename', component: JavascriptComponent, data: { customResponse: true } },
    // ]),
    ServerModule,
    ServerTransferStateModule,
  ],
  declarations: [],
  bootstrap: [AppComponent],
})
export class AppServerModule {
}